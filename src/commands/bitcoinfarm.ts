import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { CommandInteraction } from 'discord.js'
import { Cache, ErrorReponse, FormatPrice, GetItem, ResolveStrings, Round, THEmbed } from '../lib'

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
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.message(gpus, compare))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(gpus: number, compare: number) {
        if (compare == undefined) {
            const farm = new BitcoinFarm(gpus)

            return {
                embeds: [
                    new THEmbed()
                        .setTitle('Bitcoin Farm Calculator')
                        .setThumbnail(Cache.config.images.thumbnails.bitcoinfarm)
                        .addFields(
                            ResolveStrings([
                                {
                                    name: 'Bitcoin Price',
                                    value: FormatPrice(farm.BTCPrice)
                                },
                                {
                                    name: 'Amount of GPUs',
                                    value: farm.gpus
                                },
                                {
                                    name: 'Bitcoins Per Day',
                                    value: '₿ ' + Round(farm.BitcoinDay, '000')
                                },
                                {
                                    name: 'Roubles Per Day',
                                    value: FormatPrice(farm.RUBDay)
                                }
                            ])
                        )
                ]
            }
        } else {
            const farm = new BitcoinFarm(gpus)
            const farm2 = new BitcoinFarm(compare)
            return {
                embeds: [
                    new THEmbed()
                        .setTitle('Bitcoin Farm Calculator')
                        .setThumbnail(Cache.config.images.thumbnails.bitcoinfarm)
                        .addFields(
                            ResolveStrings([
                                {
                                    name: 'Bitcoin Price',
                                    value: FormatPrice(farm.BTCPrice)
                                },
                                {
                                    name: 'Difference in GPUs',
                                    value: `${Math.abs(farm.gpus - farm2.gpus)} *(${farm.gpus} - ${farm2.gpus})*`
                                },
                                {
                                    name: 'Difference in Per Day',
                                    value: '₿ ' + Round(Math.abs(farm.BitcoinDay - farm2.BitcoinDay), '000')
                                },
                                {
                                    name: 'Difference in RUB Per Day',
                                    value: FormatPrice(Math.abs(farm.RUBDay - farm2.RUBDay))
                                }
                            ])
                        )
                ]
            }
        }
    }
}

class BitcoinFarm {
    gpus: number
    BTCPrice: number

    constructor(gpus: number) {
        this.gpus = gpus
        // Finds the best trader to sell bitcoin to
        this.BTCPrice = GetItem('59faff1d86f7746c51718c9c').sellFor.sort((a, b) => {
            return b.price - a.price
        })[0].price
    }

    get BitcoinDay() {
        // Calculates the amount of bitcoin produced everyday for a given amount of gpus
        return (1 / (145000 / (1 + (this.gpus - 1) * 0.041225) / 3600)) * 24
    }

    get RUBDay() {
        return Math.round(this.BitcoinDay * this.BTCPrice)
    }
}
