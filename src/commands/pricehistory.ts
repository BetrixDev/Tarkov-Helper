import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { AutocompleteInteraction, CommandInteraction, MessageAttachment } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import SearchEngine from '../helpers/search_engines/item-engine'
import { isID, ErrorReponse, FormatPrice, ReadJson, Round, GetItem, ResolveStrings, THEmbed } from '../lib'

const Autocomplete = (interaction: AutocompleteInteraction) => {
    const input = interaction.options.getFocused(true)

    const results = SearchEngine(input.value.toString())

    interaction.respond(
        results.map((result) => {
            return { name: result.item.name, value: result.item.id }
        })
    )
}

const CheckID = (item: string | undefined) => {
    if (!item || isID(item)) return true
    else return false
}

@Discord()
export class Command {
    @Slash('pricehistory', {
        description: 'Generate a custom price history chart for one or more items'
    })
    async pricehistory(
        @SlashOption('range', {
            description: 'Range of dates shown on the graph (in days) (up to 31 days)',
            required: true
        })
        range: number,
        @SlashOption('item', {
            description: 'Item to display on the chart',
            required: true,
            autocomplete: (interaction: AutocompleteInteraction) => Autocomplete(interaction),
            type: 'STRING'
        })
        item: string,
        @SlashOption('item-2', {
            description: '2nd Item to display on the chart',
            required: false,
            autocomplete: (interaction: AutocompleteInteraction) => Autocomplete(interaction),
            type: 'STRING'
        })
        item2: string | undefined,
        @SlashOption('item-3', {
            description: '3rd Item to display on the chart',
            required: false,
            autocomplete: (interaction: AutocompleteInteraction) => Autocomplete(interaction),
            type: 'STRING'
        })
        item3: string | undefined,
        @SlashOption('item-4', {
            description: '4th Item to display on the chart',
            required: false,
            autocomplete: (interaction: AutocompleteInteraction) => Autocomplete(interaction),
            type: 'STRING'
        })
        item4: string | undefined,
        @SlashOption('item-5', {
            description: '5th Item to display on the chart',
            required: false,
            autocomplete: (interaction: AutocompleteInteraction) => Autocomplete(interaction),
            type: 'STRING'
        })
        item5: string | undefined,
        interaction: CommandInteraction
    ) {
        try {
            if (!isID(item) || !CheckID(item2) || !CheckID(item3) || !CheckID(item4) || !CheckID(item5)) {
                interaction.reply(
                    ErrorReponse('Please use the auto complete function to complete your search', interaction)
                )
                return
            }

            interaction.reply(await this.message(interaction, range, item, item2, item3, item4, item5))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    async message(
        interaction: CommandInteraction,
        range: number,
        item: string,
        item2?: string,
        item3?: string,
        item4?: string,
        item5?: string
    ) {
        const chart = new PriceChart()
        chart.range = range > 31 ? 31 : range // 31 is the max range

        const items = [item, item2, item3, item4, item5]

        items.forEach((item) => {
            if (item) chart.addItem(GetItem(item))
        })

        const renderedChart = await chart.renderChart()

        if (!renderedChart) {
            return ErrorReponse('There was en error generating your chart, please try again', interaction)
        } else {
            return {
                embeds: [
                    new THEmbed()
                        .setTitle(`Price History Graph`)
                        .addFields(
                            ResolveStrings([
                                {
                                    name: 'Shown Items',
                                    value: chart.items.map((item, i) => {
                                        return `${Colors[i].emoji} ${item.shortName}`
                                    }),
                                    inline: true
                                },
                                { name: 'Range', value: chart.range.toString(), inline: true }
                            ])
                        )
                        .setImage('attachment://chart.png')
                ],
                files: [new MessageAttachment(renderedChart, 'chart.png')]
            }
        }
    }
}

type Point = { x: number; y: number }
const Colors = [
    // Color-code the lines
    { emoji: ':yellow_circle:', color: '#DDCC4C' },
    { emoji: ':blue_circle:', color: '#55ACEE' },
    { emoji: ':red_circle:', color: '#DD2E44' },
    { emoji: ':green_circle:', color: '#7DB45D' },
    { emoji: ':purple_circle:', color: '#7B7AC2' }
]

export class PriceChart {
    private _range = 7 // in days
    private _items: Item[] = []

    get data() {
        // Used for re-creating the class in other interactions
        return { range: this._range, items: this._items }
    }

    set data(obj: { range: number; items: Item[] }) {
        this._range = obj.range
        this._items = obj.items
    }

    addItem(item: Item) {
        this._items.push(item)
    }

    set range(range: number) {
        this._range = range
    }

    get range() {
        return this._range
    }

    get items() {
        return this._items
    }

    async renderChart(): Promise<Buffer | undefined> {
        try {
            // Create the points first
            let chartData: { item: Item; data: Point[] }[][] = []

            let points: { [key: string]: { date: number; price: number }[] } = {}

            // Populate the object with empty arrays
            this._items.forEach((item) => {
                points[item.id] = []
            })

            this._items.forEach((item) => {
                let rawData: { date: number; price: number }[] = ReadJson(`./game_data/pricehistory/${item.id}.json`)
                rawData.slice(rawData.length - 48 * this._range, rawData.length)

                points[item.id].push(...rawData)
            })

            this._items.forEach((item, i) => {
                let itemPoints: Point[] = []

                points[item.id]
                    .sort((a, b) => {
                        // Sort items to put most recent data first
                        return b.date - a.date
                    })
                    .slice(0, this._range * 48)
                    .reverse()
                    .forEach((point) => {
                        itemPoints.push({ x: point.date, y: point.price })
                    })

                chartData[i] = []
                chartData[i].push({ item: item, data: itemPoints })
            })

            // Render the chart

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
            const labels: string[] = chartData[0][0].data.map((point, i) => {
                if (i % 4 == 0) {
                    const hours = Math.floor((date - point.x) / 3600000)
                    return hours <= 24 ? `${hours}h ago` : `${Round(hours / 24, '0')}d ago`
                } else {
                    return ''
                }
            })

            labels[labels.length] = 'Right Now'

            const datasets = chartData.map((itemData, i) => {
                return itemData.map((set) => {
                    return {
                        label: `${set.item.name} Price`,
                        data: set.data,
                        borderColor: Colors[i].color,
                        backgroundColor: '#15242e',
                        borderWidth: 3,
                        tension: 0.1
                    }
                })
            })

            return await chart.renderToBuffer({
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets.map((item) => {
                        return item[0]
                    })
                },
                options: {
                    scales: {
                        y: {
                            ticks: {
                                callback: (value: string | number) => FormatPrice(value)
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `${this._range}d Price History`,
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
