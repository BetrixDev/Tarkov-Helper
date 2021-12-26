import 'reflect-metadata'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { ErrorReponse, ResolveStrings } from '../lib'
import settings from '../data/settings'

@Discord()
export class ExchangeRateCommand {
    @Slash('exchangerate', {
        description: 'Convert a currency to the others'
    })
    async price(
        @SlashChoice('Euros', 'eur')
        @SlashChoice('Dollars', 'usd')
        @SlashChoice('Rubles', 'rub')
        @SlashOption('currency', {
            description: 'Currency to convert',
            required: true,
            type: 'STRING'
        })
        currency: Currencies,
        @SlashOption('amount', {
            description: 'Amount of the currency',
            required: true
        })
        amount: number,
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.message(currency, amount))
        } catch {
            interaction.reply(ErrorReponse('There was an unknown error executing this command', 'exchangerate'))
        }
    }

    message(currency: Currencies, amount: number) {
        const conversionData: { [key: string]: { operation: string; ratio: number } } = Conversions[currency]

        let conversions: string[] = []

        for (let otherCurrency in conversionData) {
            let otherData = conversionData[otherCurrency]

            conversions.push(
                `**${Names[otherCurrency]}**: ${FormatPrice(
                    otherCurrency,
                    Math.round(eval(`${amount} ${otherData.operation} ${otherData.ratio}`) * 100) / 100
                )}`
            )
        }

        return {
            embeds: [
                new MessageEmbed()
                    .setTitle(`Conversion Rate from ${FormatPrice(currency, amount)}`)
                    .setThumbnail(settings.images.thumbnails.exchangerate)
                    .setColor(settings.botSettings.color)
                    .setDescription(`Below will show the value of ${Names[currency]} in other currencies`)
                    .addFields(
                        ResolveStrings([
                            {
                                name: 'Conversions',
                                value: conversions
                            }
                        ])
                    )
            ]
        }
    }
}

type Currencies = keyof typeof Conversions

const Conversions = {
    rub: {
        usd: {
            ratio: 114,
            operation: '/'
        },
        eur: {
            ratio: 127,
            operation: '/'
        }
    },
    usd: {
        rub: {
            ratio: 114,
            operation: '*'
        },
        eur: {
            ratio: 0.897,
            operation: '*'
        }
    },
    eur: {
        rub: {
            ratio: 127,
            operation: '*'
        },
        usd: {
            ratio: 0.897,
            operation: '/'
        }
    }
}

const Names: { [key: string]: {} } = {
    usd: 'Dollars',
    rub: 'Roubles',
    eur: 'Euros'
}

function FormatPrice(currency: string, price: number) {
    return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: currency.toUpperCase(),
        maximumSignificantDigits: 6
    })
        .format(Number(price))
        .replace('RUB', '₽')
        .replace(' ', '')
}
