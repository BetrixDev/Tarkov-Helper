const Settings = require('../settings.json')

class BitcoinFarmCalc {
    constructor(amount) {
        this.BTCPerDay = (1 / ((110000 / (1 + (amount - 1) * 0.044225)) / 3600)) * 24
        this.RUBPerDay = this.BTCPerDay * 650000
    }
}

const bitcoinfarm = (DiscordJS, args) => {
    const Calculation = new BitcoinFarmCalc(args['gpus'])

    if (args['compare-gpus'] === undefined) {
        const Embed = new DiscordJS.MessageEmbed()
            .setColor(Settings.BotSettings['Color'])
            .setTitle('Bitcoin Farm Calculator')
            .setThumbnail(Settings.Images.Thumbnails['BitcoinFarm'])
            .addFields({
                name: "Bitcoin Price:",
                value: '₽650,000'
            }, {
                name: "Amount of GPUS:",
                value: args['gpus']
            }, {
                name: "Bitcoins Per Day:",
                value: Calculation.BTCPerDay
            }, {
                name: "Roubles Per Day:",
                value: `₽${Math.round(Calculation.RUBPerDay).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            })
        return Embed
    } else {
        const SecondCalculation = new BitcoinFarmCalc(args['compare-gpus'])

        const Embed = new DiscordJS.MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle('Bitcoin Farm Calculator')
            .setThumbnail(Settings.Images.Thumbnails['BitcoinFarm'])
            .addFields({
                name: "Bitcoin Price:",
                value: '₽650,000'
            }, {
                name: "Difference in GPUS:",
                value: (Math.abs(args['gpus'] - args['compare-gpus']))
            }, {
                name: "Difference in Bitcoins Per Day:",
                value: Math.abs(Calculation.BTCPerDay - SecondCalculation.BTCPerDay)
            }, {
                name: "Difference in Roubles Per Day:",
                value: `₽${Math.abs((Math.round(Calculation.RUBPerDay) - Math.round(SecondCalculation.RUBPerDay))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            })
        return Embed
    }
}

exports.bitcoinfarm = bitcoinfarm