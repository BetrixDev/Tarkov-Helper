import 'reflect-metadata'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { injectable } from 'tsyringe'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions, MessageAttachment } from 'discord.js'
import { autoCompleteResults } from '../helpers/search_engines/item-engine'
import { Item } from '../data/classes/item'
import { formatPrice, round, THEmbed, translation } from '../lib'
import axios from 'axios'
import { isId } from '../data/cache'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

const PRICE_HISTORY_URL = process.env.PRICE_HISTORY_URL as string

// Makes use of https://github.com/BetrixDev/item-price-logger

@Discord()
@injectable()
export class PriceHistoryCommand {
    @Slash('pricehistory', {
        description: 'Generate a custom price history chart for one or more items'
    })
    async pricehistory(
        @SlashOption('range', {
            description: 'Range of dates shown on the graph (in days) (up to 31 days)'
        })
        range: number,
        @SlashOption('item', {
            description: 'Item to display on the chart',
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction),
            type: 'STRING'
        })
        item: string,
        @SlashOption('item-2', {
            description: '2nd Item to display on the chart',
            required: false,
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction),
            type: 'STRING'
        })
        item2: string | undefined,
        @SlashOption('item-3', {
            description: '3rd Item to display on the chart',
            required: false,
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction),
            type: 'STRING'
        })
        item3: string | undefined,
        @SlashOption('item-4', {
            description: '4th Item to display on the chart',
            required: false,
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction),
            type: 'STRING'
        })
        item4: string | undefined,
        @SlashOption('item-5', {
            description: '5th Item to display on the chart',
            required: false,
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction),
            type: 'STRING'
        })
        item5: string | undefined,
        interaction: CommandInteraction,
        client: Client,
        { Language }: ServerData
    ): Promise<InteractionReplyOptions> {
        return new Promise(async (respond, error) => {
            const t = translation(Language)

            const chart = new PriceChart()
            chart.range = range
            ;[item, item2, item3, item4, item5].forEach((item) => chart.addItem(item))

            chart.render(Language).then((img) => {
                if (!img) {
                    error(t('There was en error generating your chart, please try again'))
                } else {
                    respond({
                        embeds: [
                            new THEmbed()
                                .setTitle(`Price History Graph`)
                                .addFields(
                                    {
                                        name: t('Shown Items'),
                                        value: chart.items
                                            .map((id, i) => {
                                                const item = new Item(id, Language)
                                                return `${colors[i].emoji} ${item.shortName}`
                                            })
                                            .join('\n'),
                                        inline: true
                                    },
                                    { name: 'Range', value: chart.range.toString(), inline: true }
                                )
                                .setImage('attachment://chart.png')
                        ],
                        files: [new MessageAttachment(img, 'chart.png')]
                    })
                }
            })
        })
    }
}

interface PriceHistoryPoint {
    date: number
    price: number
}

interface PriceHistoryResponse {
    pricehistory: PriceHistoryPoint[]
}

interface Point {
    date: number
    price: number
}

interface Line {
    item: Item
    points: Point[]
}

const colors = [
    // Color-code the lines
    { emoji: ':yellow_circle:', color: '#DDCC4C' },
    { emoji: ':blue_circle:', color: '#55ACEE' },
    { emoji: ':red_circle:', color: '#DD2E44' },
    { emoji: ':green_circle:', color: '#7DB45D' },
    { emoji: ':purple_circle:', color: '#7B7AC2' }
]

export class PriceChart {
    range = 7
    items: string[] = []

    addItem(id: string | undefined) {
        if (id && isId(id)) {
            this.items.push(id)
        }
    }

    async render(language: Languages): Promise<Buffer | undefined> {
        try {
            const t = translation(language)

            const chartData: Line[] = []

            for (let id of this.items) {
                const item = new Item(id, language)

                const itemPriceData = await axios
                    .get<PriceHistoryResponse>(`${PRICE_HISTORY_URL}/${id}/${this.range}`)
                    .then((res) => res.data.pricehistory)

                chartData.push({ item, points: itemPriceData })
            }

            const chart = new ChartJSNodeCanvas({
                width: 2560,
                height: 1080,
                backgroundColour: '#15242e',
                chartCallback: (ChartJS) => {
                    ChartJS.defaults.color = '#FFFFFF'
                    ChartJS.defaults.font = {
                        size: 24,
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        style: 'normal',
                        weight: null,
                        lineHeight: 1.2
                    }
                }
            })

            const date = Date.now()
            const labels: string[] = chartData[0].points.map((point, i) => {
                if (1 % 4 == 0) {
                    const hours = Math.floor((date - point.date) / 3600000)
                    return hours <= 24 ? t('{0}h ago', hours) : t('{0}d ago', round(hours / 24, '0'))
                } else {
                    return ''
                }
            })

            labels[labels.length] = t('Right Now')

            const datasets = chartData.map(({ item, points }, i) => {
                return {
                    label: t('{0} Price', item.name),
                    data: points.map((p) => ({ x: p.date, y: p.price })),
                    borderColor: colors[i].color,
                    backgroundColor: '#15242e',
                    borderWidth: 3,
                    tension: 0.1
                }
            })

            return await chart.renderToBuffer({
                type: 'line',
                data: {
                    labels,
                    datasets
                },
                options: {
                    scales: {
                        y: {
                            ticks: {
                                callback: (value) => formatPrice(value)
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: t('{0}d Price History', this.range),
                            font: {
                                size: 30
                            }
                        }
                    }
                }
            })
        } catch (e) {
            console.log(e)
            return undefined
        }
    }
}
