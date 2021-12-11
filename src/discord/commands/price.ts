import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import settings from '../../data/bot/settings'
import { CapitalizeWords, FormatPrice, GetItem, ItemImage, ItemSearchMessage, ResolveStrings, SearchEngine } from '../../Lib'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('price', {
        description: 'Returns price info of a specified item'
    })
    price(
        @SlashOption('item', {
            description: 'What item to get the price of',
            required: true
        })
        item: string,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: { item: any }): Promise<InteractionReplyOptions> => {
    const result = SearchEngine(args.item)
    let item: Item = args.item

    if (result.error) {
        return {
            embeds: [result.error],
            ephemeral: true
        }
    } else if (result.results.length > 1) {
        return ItemSearchMessage(args, result.results, {
            command: 'price',
            variable: 'item',
            args,
            interaction
        })
    } else {
        item = GetItem(result.results[0].id)
    }

    const extraData = new PriceData(item)
    const sellPrices = extraData.sellingPrices()
    const buyPrices = extraData.buyingPrices()

    if (item.avg24hPrice == 0) {
        return {
            embeds: [
                new MessageEmbed()
                    .setTitle(`${item.shortName} Price Data`)
                    .setThumbnail(ItemImage(item.id))
                    .setDescription(
                        `
                        [Wiki Link](${item.wikiLink})
                        **This item has no offers on the Flea Market**
                        Item prices may not be up to date until a week or two after the wipe
                        `
                    ) // REMOVE AFTER WIPE
                    .addFields({
                        name: 'Best Sells',
                        value: `${sellPrices[0]?.source ?? ''} at ${sellPrices[0]?.price ?? ''}/each`
                    })
            ]
        }
    } else {
        return {
            embeds: [
                new MessageEmbed()
                    .setColor(settings.botSettings.color)
                    .setTitle(`${item.shortName} Price Data - ${FormatPrice(item.lastLowPrice)}`)
                    .setDescription(`[Wiki Link](${item.wikiLink})\nItem prices may not be up to date until a week or two after the wipe`) // REMOVE AFTER WIPE
                    .setThumbnail(ItemImage(item.id))
                    .addFields(
                        ResolveStrings([
                            {
                                name: 'Price Right Now',
                                value: FormatPrice(item.lastLowPrice),
                                inline: true
                            },
                            {
                                name: 'Price Per Slot',
                                value: FormatPrice(extraData.pricePerSlot()),
                                inline: true
                            },
                            {
                                name: 'Avg 24hr Price',
                                value: `${FormatPrice(item.avg24hPrice)} (${item.changeLast48h}%)`,
                                inline: true
                            },
                            {
                                name: 'Best Sells',
                                value: `**${sellPrices[0].source}** at **${sellPrices[0].price}**/each or ${sellPrices[1].source} at ${sellPrices[1].price}/each`
                            },
                            {
                                name: 'Best Buy',
                                value: `${buyPrices[0].source} at ${buyPrices[0].price}`
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

class PriceData {
    sellFor: [ItemPrice]
    buyFor: [ItemPrice]
    price: number
    size: { width: number; height: number }
    constructor(item: Item) {
        this.price = item.lastLowPrice
        this.sellFor = item.sellFor
        this.buyFor = item.buyFor
        this.size = {
            width: item.width,
            height: item.height
        }
    }
    pricePerSlot() {
        const totalSize = this.size.width * this.size.height

        return Math.floor(this.price / totalSize)
    }
    sellingPrices() {
        const offers = this.sellFor

        return offers
            .sort((a, b) => {
                return b.price - a.price
            })
            .map((offer) => {
                return {
                    source: CapitalizeWords(offer.source.toString()),
                    price: FormatPrice(offer.price, offer.source.toString())
                }
            })
    }
    buyingPrices() {
        const offers = this.buyFor

        return offers
            .sort((a, b) => {
                return a.price - b.price
            })
            .map((offer) => {
                return {
                    source: CapitalizeWords(offer.source.toString()),
                    price: FormatPrice(offer.price, offer.source.toString())
                }
            })
    }
}
