import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import 'reflect-metadata'
import settings from '../../data/bot/settings'
import { FormatPrice, GetItem, ResolveStrings, Round } from '../../Lib'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('bitcoinfarm', {
        description: 'Returns price info of a specified item'
    })
    async bitcoin(
        @SlashOption('gpus', {
            description: 'Calculate the amount of money obtained from a certain amount of Graphics Cards',
            required: true
        })
        gpus: number,
        @SlashOption('compare', {
            description: 'Use this to display the difference between two different GPU amount',
            required: false
        })
        compare: number,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: { gpus: number; compare: number }): Promise<InteractionReplyOptions> => {
    const { gpus, compare } = args

    if (compare == undefined) {
        const farm = new BitcoinFarm(gpus)

        return {
            embeds: [
                new MessageEmbed()
                    .setTitle('Bitcoin Farm Calculator')
                    .setThumbnail(settings.images.thumbnails.bitcoinfarm)
                    .setColor(settings.botSettings.color)
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
                new MessageEmbed()
                    .setTitle('Bitcoin Farm Calculator')
                    .setThumbnail(settings.images.thumbnails.bitcoinfarm)
                    .setColor(settings.botSettings.color)
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

/*
    Data for command
*/

class BitcoinFarm {
    gpus: number
    BTCPrice: number

    constructor(gpus: number) {
        this.gpus = gpus
        // Finds the best trader to sell bitcoin to
        this.BTCPrice = GetItem('59faff1d86f7746c51718c9c').sellFor.sort((a: { price: number }, b: { price: number }) => {
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
