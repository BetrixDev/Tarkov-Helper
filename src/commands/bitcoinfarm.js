require('../utils')
const { MessageEmbed } = require('discord.js')
const { BitcoinFarmCalc } = require('../classes/bitcoinfarmcalc')

module.exports = {
    data: {
        name: 'bitcoinfarm',
        description: 'Calculate the amount of money obtained from a certain amount of Graphics Cards',
        options: [{
                name: 'gpus',
                description: 'Amount of GPUS to calculate with',
                required: true,
                type: 4
            },
            {
                name: "compare-gpus",
                description: 'Use this to display the difference between two different GPU amount',
                required: false,
                type: 4
            }
        ]
    },
    message: function(args) {
        const Calculation = new BitcoinFarmCalc(args['gpus'])

        if (args['compare-gpus'] === undefined) {
            return {
                Type: "serverMessage",
                Content: new MessageEmbed()
                    .setColor(Settings.BotSettings.Color)
                    .setTitle('Bitcoin Farm Calculator')
                    .setThumbnail(Settings.Images.Thumbnails.BitcoinFarm)
                    .addFields(ResolveStrings([{
                        name: "Bitcoin Price",
                        value: FormatPrice(Calculation.BTCPrice)
                    }, {
                        name: "Amount of GPUS",
                        value: args['gpus']
                    }, {
                        name: "Bitcoins Per Day",
                        value: Calculation.BTCPerDay
                    }, {
                        name: "Roubles Per Day",
                        value: FormatPrice(Math.round(Calculation.RUBPerDay))
                    }]))
            }
        } else if (args['compare-gpus'] !== undefined) {
            const SecondCalculation = new BitcoinFarmCalc(args['compare-gpus'])

            return {
                Type: "serverMessage",
                Content: new MessageEmbed()
                    .setColor(Settings.BotSettings.Color)
                    .setTitle('Bitcoin Farm Calculator')
                    .setThumbnail(Settings.Images.Thumbnails.BitcoinFarm)
                    .addFields(ResolveStrings([{
                        name: "Bitcoin Price",
                        value: FormatPrice(Calculation.BTCPrice)
                    }, {
                        name: "Difference in GPUS",
                        value: (Math.abs(args['gpus'] - args['compare-gpus']))
                    }, {
                        name: "Difference in Bitcoins Per Day",
                        value: Math.abs(Calculation.BTCPerDay - SecondCalculation.BTCPerDay)
                    }, {
                        name: "Difference in Roubles Per Day",
                        value: FormatPrice(Math.abs((Math.round(Calculation.RUBPerDay) - Math.round(SecondCalculation.RUBPerDay))))
                    }]))
            }
        }
    }
}