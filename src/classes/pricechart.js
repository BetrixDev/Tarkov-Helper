require('../utils')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const itemFromID = ReadJson('./src/game_data/api/itemfromid.json')
const moment = require('moment-timezone')

const TimeAgo = require('javascript-time-ago')
TimeAgo.addDefaultLocale(require('javascript-time-ago/locale/en'))
const timeAgo = new TimeAgo('en-US')

const priceHistoryDir = './src/game_data/pricehistory/'

function getDate(mili) {
    if (mili !== undefined) {
        return moment(mili).format('MM-DD-YYYY').toUpperCase()
    } else {
        return moment().tz('America/New_York').format('MM-DD-YYYY').toUpperCase()
    }
}

class Chart {
    constructor(options) {
        this.chartData = []
        this.width = options?.width || 1280
        this.height = options?.height || 720

        this.range = (options?.range || 1) * 86400000
    }
    GeneratePoints(item, options) {
        let date = getDate()
        let file = priceHistoryDir + date + '.json'

        let priceData = new Array()
        let currentHistory = ReadJson(file)[item]
        let missing = 48 - currentHistory.length
        let pastHistory = ReadJson(priceHistoryDir + getDate(Date.now() - 86400000) + '.json')[item]

        if (pastHistory.length < missing) {
            priceData = pastHistory
        } else {
            priceData.push(...pastHistory.slice(missing))
        }

        priceData.push(...currentHistory)

        let points = new Array()
        let dates = new Array()

        for (let i = 0; i < priceData.length; i++) {
            let point = priceData[i]

            points.push(point.price)

            if (i % 4 == 0) {
                dates.push(timeAgo.format(point.date))
            } else {
                dates.push(' ')
            }
        }

        dates[dates.length - 1] = 'now'

        this.chartData.push({
            points,
            dates,
            item: itemFromID[item].Name,
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
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: (value) => FormatPrice(value)
                        }
                    }]
                }
            }
        }
        return await chart.renderToBuffer(config)
    }
}

exports.Chart = Chart