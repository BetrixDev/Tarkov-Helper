require('../utils')
const ColorScheme = require('color-scheme')
const simpleColorConverter = require('simple-color-converter')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')

let scheme = new ColorScheme
scheme
    .from_hue(90)
    .scheme('contrast')
    .variation('default')

let clrs = scheme.colors()
let colors = clrs
scheme.from_hue(180).colors().forEach(color => colors.push(color))

class Chart {
    constructor(calibers, caliberName) {
        this.chartData = new Array()
        this.width = 960
        this.height = 540

        this.caliberName = caliberName

        let caliberData = calibers.sort(function (a, b) {
            return a['Penetration'] - b['Penetration']
        })

        for (let i = 0; i < caliberData.length; i++) {
            let bullet = caliberData[i]
            let c = new simpleColorConverter({ hex6: colors[i], to: 'rgba' }).color
            let pointColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
            let point = { y: bullet.Damage, x: bullet.Penetration, r: 15 }

            this.chartData.push({
                data: [point],
                label: bullet.Name,
                backgroundColor: pointColor
            })
        }
    }
    async RenderChart() {
        const chart = new ChartJSNodeCanvas({ width: this.width, height: this.height })

        console.log(chart)

        chart._chartJs.defaults.global.defaultFontFamily = "'Verdana', sans-serif"
        chart._chartJs.defaults.global.defaultFontColor = '#FFFFFF'

        let config = {
            type: 'bubble',
            data: {
                datasets: this.chartData
            },
            options: {
                style: {
                    strokewidth: 10
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 15
                            //max: 200
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Damage',
                            fontSize: 20
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 90,
                            fontSize: 15
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Penetration',
                            fontSize: 20
                        }
                    }]
                },
                title: {
                    display: true,
                    text: this.caliberName + ' Damage / Penetration Chart',
                    fontSize: 22
                }
            }
        }
        return await chart.renderToBuffer(config)
    }
}

exports.Chart = Chart