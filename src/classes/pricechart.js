require('../utils')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const priceHistory = ReadJson('./src/bot_data/pricehistory.json')
const itemFromID = ReadJson('./src/game_data/api/itemfromid.json')

const TimeAgo = require('javascript-time-ago')
TimeAgo.addDefaultLocale(require('javascript-time-ago/locale/en'))
const timeAgo = new TimeAgo('en-US')

class Chart {
    constructor(options) {
        this.chartData = []
        this.width = options?.width || 1280
        this.height = options?.height || 720

        this.range = (options?.range || 7) * 86400000
    }
    GeneratePoints(item, options) {
        let priceData = priceHistory[item]
        let itemName = itemFromID[item].ShortName
        let time = Date.now()

        if (priceData == undefined) {
            return
        }

        let furthestValue = 0
        for (let i = 0; i < priceData.length; i++) {
            if (priceData[i].time + this.range > time) {
                furthestValue = i - 1
                break
            }
        }

        priceData = priceData.slice(furthestValue, priceData.length)

        let points = new Array()
        let dates = new Array()

        for (let i = 0; i < priceData.length; i++) {
            let point = priceData[i]

            points.push(point.price)

            if (i % 4 == 0) {
                dates.push(timeAgo.format(point.time))
            } else {
                dates.push(' ')
            }
        }

        dates[dates.length - 1] = 'now'

        this.chartData.push({
            points,
            dates, item: itemName,
            border: options?.border || 'rgba(221, 204, 76, 1)',
            background: options?.background || 'rgba(21, 36, 46, 1)'
        })
    }
    async RenderChart() {
        const chart = new ChartJSNodeCanvas({ width: this.width, height: this.height })

        let data = this.chartData

        let config = {
            type: 'line',
            data: {
                labels: data[0].dates,
                datasets: data.map(set => {
                    return {
                        label: `Price of ${set.item}`,
                        data: set.points,
                        backgroundColor: set.background,
                        borderColor: set.border,
                        borderWidth: 3
                    }
                })
            }
        }
        return await chart.renderToBuffer(config)
    }
}

exports.Chart = Chart