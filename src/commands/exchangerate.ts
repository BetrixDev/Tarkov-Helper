import 'reflect-metadata'
import { Client, Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { handleCommandInteraction, THEmbed, translation } from '../Lib'
import botConfig from '../config/BotConfig'

// https://escapefromtarkov.fandom.com/wiki/Currency
// Should automate these using the item prices
const CONVERSIONS: { [key: string]: { [key: string]: { ratio: number; operation: string } } } = {
    rub: {
        usd: {
            ratio: 172,
            operation: '/'
        },
        eur: {
            ratio: 194,
            operation: '/'
        }
    },
    usd: {
        rub: {
            ratio: 172,
            operation: '*'
        },
        eur: {
            ratio: 0.887,
            operation: '*'
        }
    },
    eur: {
        rub: {
            ratio: 194,
            operation: '*'
        },
        usd: {
            ratio: 0.887,
            operation: '/'
        }
    }
}

const NAMES: { [key: string]: string } = {
    usd: 'Dollars',
    rub: 'Roubles',
    eur: 'Euros'
}

function formatPrice(currency: string, price: number) {
    return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: currency.toUpperCase(),
        maximumSignificantDigits: 6
    })
        .format(Number(price))
        .replace('RUB', '₽')
        .replace(' ', '')
}

@Discord()
export abstract class ExchangeRateCommand {
    @Slash('exchangerate', {
        description: 'Convert a currency to the others'
    })
    async exchangerate(
        @SlashChoice('Euros', 'eur')
        @SlashChoice('Dollars', 'usd')
        @SlashChoice('Rubles', 'rub')
        @SlashOption('currency', {
            description: 'Currency to convert',
            type: 'STRING'
        })
        currency: string,
        @SlashOption('amount', {
            description: 'Amount of the currency'
        })
        amount: number,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                respond(ExchangeRateCommand.message(currency, amount, Language))
            })
        )
    }

    static message(currency: string, amount: number, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        const conversionData = CONVERSIONS[currency]

        let conversions: string[] = []

        for (let otherCurrency in conversionData) {
            let otherData = conversionData[otherCurrency]

            conversions.push(
                `**${t(NAMES[otherCurrency])}**: ${formatPrice(
                    otherCurrency,
                    Math.round(eval(`${amount} ${otherData.operation} ${otherData.ratio}`) * 100) / 100
                )}`
            )
        }

        return {
            embeds: [
                new THEmbed()
                    .setTitle(t(`Conversion Rate from {0}`, formatPrice(currency, amount)))
                    .setThumbnail(botConfig.images.thumbnails.exchangerate)
                    .setDescription(
                        `*${t(`Below will show the value of {0} in other currencies`, t(NAMES[currency]))}*`
                    )
                    .addFields({
                        name: t('Conversions'),
                        value: conversions.join('\n')
                    })
            ]
        }
    }
}
