require('../utils')
const { MessageEmbed } = require('discord.js')

const Conversions = {
    rub: {
        usd: {
            ratio: 116,
            operation: '/'
        },
        eur: {
            ratio: 130,
            operation: '/'
        }
    },
    usd: {
        rub: {
            ratio: 116,
            operation: '*'
        },
        eur: {
            ratio: 0.892,
            operation: '*'
        }
    },
    eur: {
        rub: {
            ratio: 130,
            operation: '*'
        },
        usd: {
            ratio: 0.892,
            operation: '/'
        }
    }
}

const Names = {
    usd: 'Dollars',
    rub: 'Roubles',
    eur: 'Euros'
}

function FormatPrice(Currency, Price) {
    return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: Currency.toUpperCase(),
        maximumSignificantDigits: 6,
    }).format(Number(Price)).replace('RUB', '₽').replace(' ', '')
}

function GetConversions(Currency, Amount) {
    let Data = Conversions[Currency]

    let Output = new Array()

    for (let OtherCurrency in Data) {
        let OtherData = Data[OtherCurrency]

        Output.push(`**${Names[OtherCurrency]}**: ${FormatPrice(OtherCurrency, Math.round(eval(`${Amount} ${OtherData.operation} ${OtherData.ratio}`) * 100) / 100)}`)
        
    }

    return Output
}

module.exports = {
    data: {
        name: 'exchangerate',
        description: 'Convert one currency to another.',
        options: [{
                type: 3,
                name: "currency",
                description: "Name of first currency",
                required: true,
                choices: [{
                        name: "Rubles",
                        value: "rub"
                    },
                    {
                        name: "Dollars",
                        value: "usd"
                    },
                    {
                        name: "Euros",
                        value: "eur"
                    }
                ]
            },
            {
                type: 4,
                name: "amount",
                description: "Amount of first currency",
                required: true
            }
        ]
    },
    message: (args) => {
        let Currency = args['currency']
        let Amount = args['amount']

        return {
            Type: "serverMessage",
            Content: new MessageEmbed()
                .setColor(Settings.BotSettings.Color)
                .setTitle(`Conversion Rate from ${FormatPrice(Currency, Amount)}`)
                .setThumbnail(Settings.Images.Thumbnails.ExchangeRate)
                .setDescription(`Below will show the value of ${Names[Currency]} in other currencies`)
                .addFields(ResolveStrings([{
                    name: 'Conversions',
                    value: GetConversions(Currency, Amount)
                }]))
        }
    }
}