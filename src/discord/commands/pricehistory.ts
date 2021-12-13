import 'reflect-metadata'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { CommandInteraction, InteractionReplyOptions, MessageAttachment, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { readFileSync } from 'fs'
import settings from '../../botConfig'
import { ErrorMessage, FormatPrice, GetItem, ItemSearchMessage, ReadJson, ResolveStrings, Round, SearchEngine } from '../../Lib'

const ErrorImage = readFileSync('./data/command/images/charterror.png')

type Args = {
    range: number
    item: string
    'item-2': string | undefined
    'item-3': string | undefined
    'item-4': string | undefined
    'item-5': string | undefined
}

/*
    Class for dealing with registering command
*/

@Discord()
export class Command {
    @Slash('pricehistory', {
        description: 'Generate a custom price history chart'
    })
    async pricehistory(
        @SlashOption('range', {
            description: 'Range of dates shown on the graph (in days) (up to 31 days)',
            required: true
        })
        range: number,
        @SlashOption('item', {
            description: 'Item to display on the chart',
            required: true
        })
        item: string,
        @SlashOption('item-2', {
            description: '2nd Item to display on the chart',
            required: false
        })
        item2: string,
        @SlashOption('item-3', {
            description: '3rd Item to display on the chart',
            required: false
        })
        item3: string,
        @SlashOption('item-4', {
            description: '4th Item to display on the chart',
            required: false
        })
        item4: string,
        @SlashOption('item-5', {
            description: '5th Item to display on the chart',
            required: false
        })
        item5: string,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: Args): Promise<InteractionReplyOptions> => {
    // Create chart before we resolve the items so we can add item to chat as we go
    const chart = new PriceChart()
    chart.range = args.range > 31 ? 31 : args.range // 31 is the max range

    // Run all inputs through the search engine
    const searchResults = [
        SearchEngine(args['item']),
        SearchEngine(args['item-2']),
        SearchEngine(args['item-3']),
        SearchEngine(args['item-4']),
        SearchEngine(args['item-5'])
    ]

    for (let i in searchResults) {
        const item = searchResults[i]
        let results = item.results

        if (results.length > 0) {
            const itemArgs: { [key: string]: string | undefined } = {
                item: args['item'],
                item2: args['item-2'],
                item3: args['item-3'],
                item4: args['item-4'],
                item5: args['item-5']
            }
            let field: string = i !== '0' ? 'item' + (Number(i) + 1) : 'item'

            if (item.error) {
                return {
                    embeds: [item.error],
                    ephemeral: true
                }
            } else if (results.length > 1) {
                return {
                    ...ItemSearchMessage(itemArgs, results, {
                        command: 'pricehistory',
                        variable: field,
                        args,
                        interaction
                    }),
                    ephemeral: true
                }
            }

            chart.addItem(GetItem(results[0].id))
        }
    }

    const renderedChart = await chart.renderChart()

    if (renderedChart == ErrorImage) {
        return {
            ephemeral: true,
            embeds: [ErrorMessage('There was en error generating your chart, please try again')]
        }
    } else {
        return {
            embeds: [
                new MessageEmbed()
                    .setTitle(`Price History Graph`)
                    .setColor(settings.botSettings.color)
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

/*
    Data for command
*/

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

    async renderChart(): Promise<Buffer> {
        try {
            // Create the points first
            let chartData: { item: Item; data: Point[] }[][] = []

            let points: { [key: string]: { date: number; price: number }[] } = {}

            // Populate the object with empty arrays
            this._items.forEach((item) => {
                points[item.id] = []
            })

            this._items.forEach((item) => {
                let rawData: { date: number; price: number }[] = ReadJson(`./data/command/pricehistory/${item.id}.json`)
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
        } catch {
            return ErrorImage
        }
    }
}
