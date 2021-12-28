import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from 'discord.js'
import SearchEngine from '../helpers/search_engines/item-engine'
import {
    CapitalizeWords,
    ErrorReponse,
    FormatPrice,
    GetItem,
    isID,
    isShortName,
    ItemImage,
    ResolveStrings
} from '../lib'
import settings from '../data/settings'

@Discord()
export abstract class PriceCommand {
    @Slash('price', { description: 'Returns price info of a specified item' })
    price(
        @SlashOption('item', {
            description: 'item to lookup (start typing to search)',
            required: true,
            autocomplete: (interaction: AutocompleteInteraction) => {
                const input = interaction.options.getFocused(true)

                const results = SearchEngine(input.value.toString())

                interaction.respond(
                    results.map((result) => {
                        return { name: result.item.name, value: result.item.id }
                    })
                )
            },
            type: 'STRING'
        })
        id: string,
        interaction: CommandInteraction
    ) {
        try {
            if (!isID(id)) {
                const isShort = isShortName(id)
                if (isShort) {
                    id = isShort.id
                } else {
                    interaction.reply(
                        ErrorReponse('Please use the auto complete function to complete your search', interaction)
                    )
                    return
                }
            }
            interaction.reply(this.message(id))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(id: string) {
        const item = GetItem(id)
        const extras = new PriceData(item)

        const sellPrices = extras.sellingPrices()
        const buyPrices = extras.buyingPrices()

        if (item.avg24hPrice == 0) {
            return {
                embeds: [
                    new MessageEmbed()
                        .setColor(settings.botSettings.color)
                        .setTitle(`${item.shortName} Price Data`)
                        .setThumbnail(ItemImage(item.id))
                        .setDescription(
                            `
                            [Wiki Link](${item.wikiLink})
                            **This item has no offers on the Flea Market**
                            `
                        )
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
                        .setDescription(`[Wiki Link](${item.wikiLink})`)
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
                                    value: FormatPrice(extras.pricePerSlot()),
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
}

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
