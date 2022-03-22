import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { Item } from '../data/classes/item'
import { formatPrice, handleCommandInteraction, round, THEmbed, translation } from '../lib'
import botConfig from '../config/bot-config'

@Discord()
export class BitcoinFarmCommand {
    @Slash('bitcoinfarm', { description: 'Calculates the price and profit of a specified barter' })
    price(
        @SlashOption('gpus', {
            description: 'Calculates the amounts of BTC per day for a given amount of GPUs'
        })
        gpus: number,
        @SlashOption('compare', {
            description: 'Use this to display the difference between two different GPU amount',
            required: false
        })
        compare: number,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                if (gpus === compare) {
                    const t = translation(Language)

                    error(t('Please make sure both input fields are not the same'))
                } else {
                    respond(BitcoinFarmCommand.message(Language, gpus, compare))
                }
            })
        )
    }

    static message(language: Languages, gpus: number, compare?: number): InteractionReplyOptions {
        const t = translation(language)

        if (compare === undefined) {
            const farm = new BitcoinFarm(gpus)

            return {
                embeds: [
                    new THEmbed()
                        .setTitle(t('Bitcoin Farm Calculator'))
                        .setThumbnail(botConfig.images.thumbnails.bitcoinfarm)
                        .setDescription(`*${t('This calculator does not account for any special bonuses')}*`)
                        .setFields(
                            { name: t('Bitcoin Price'), value: formatPrice(farm.btcPrice) },
                            {
                                name: t('Amount of GPUS'),
                                value: farm.gpus.toString()
                            },
                            {
                                name: t('Bitcoins Per Day'),
                                value: `₿ ${round(farm.bitcoinsPerDay, '000')}`
                            },
                            {
                                name: t('Roubles Per Day'),
                                value: formatPrice(farm.rubPerDay)
                            }
                        )
                ]
            }
        } else {
            const farm = new BitcoinFarm(gpus)
            const farm2 = new BitcoinFarm(compare)

            return {
                embeds: [
                    new THEmbed()
                        .setTitle(t('Bitcoin Farm Calculator'))
                        .setThumbnail(botConfig.images.thumbnails.bitcoinfarm)
                        .setDescription(`*${t('This calculator does not account for any special bonuses')}*`)
                        .addFields(
                            {
                                name: t('Bitcoin Price'),
                                value: formatPrice(farm.btcPrice)
                            },
                            {
                                name: t('Difference in GPUs'),
                                value: `${Math.abs(farm.gpus - farm2.gpus)} *(${farm.gpus} - ${farm2.gpus})*`
                            },
                            {
                                name: t('Difference in Bitcoins Per Day'),
                                value: '₿ ' + round(Math.abs(farm.bitcoinsPerDay - farm2.bitcoinsPerDay), '000')
                            },
                            {
                                name: t('Difference in RUB Per Day'),
                                value: formatPrice(Math.abs(farm.rubPerDay - farm2.rubPerDay))
                            }
                        )
                ]
            }
        }
    }
}

export class BitcoinFarm {
    gpus: number
    btcPrice: number

    constructor(gpus: number) {
        this.gpus = gpus

        // Get the highest selling price
        this.btcPrice = new Item('59faff1d86f7746c51718c9c', 'en').sellingPrice()?.price as number
    }

    get bitcoinsPerDay() {
        // https://escapefromtarkov.fandom.com/wiki/Hideout#Additional_Information
        return (1 / (145000 / (1 + (this.gpus - 1) * 0.041225) / 3600)) * 24
    }

    get rubPerDay() {
        return Math.round(this.bitcoinsPerDay * this.btcPrice)
    }
}
