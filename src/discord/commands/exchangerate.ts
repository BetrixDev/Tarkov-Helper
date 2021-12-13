import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import settings from '../../botConfig'
import { ResolveStrings } from '../../Lib'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('exchangerate', {
        description: 'Convert a currency to the others'
    })
    async price(
        @SlashChoice('Euros', 'eur')
        @SlashChoice('Dollars', 'usd')
        @SlashChoice('Rubles', 'rub')
        @SlashOption('currency', {
            description: 'Currency to convert',
            required: true
        })
        currency: Currencies,
        @SlashOption('amount', {
            description: 'Amount of the currency',
            required: true
        })
        amount: number,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: { currency: Currencies; amount: number }): Promise<InteractionReplyOptions> => {
    return new Promise<InteractionReplyOptions>(async (respond, error) => {
        const { currency, amount } = args

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

        respond({
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
        })

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}

/*
    Data for command
*/

type Currencies = keyof typeof Conversions

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
