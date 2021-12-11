import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { CommandInteraction, EmbedFieldData, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { FormatPrice, GetBarter, GetItem, ItemImage, ItemSearchMessage, SearchEngine } from '../../Lib'
import settings from '../../data/bot/settings'

/*
    Class for dealing with registering command
*/

@Discord()
abstract class Command {
    @Slash('barter', {
        description: 'Calculates the price and profit of a specified barter'
    })
    async bater(
        @SlashOption('item', {
            description: 'Item to get barter data from',
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
            command: 'barter',
            variable: 'item',
            args,
            interaction
        })
    } else {
        item = GetItem(result.results[0].id)
    }

    const barterData = new BaterData(item.id)

    if (barterData.Barters.length === 0) {
        return {
            embeds: [
                new MessageEmbed()
                    .setThumbnail(ItemImage(item.id))
                    .setColor(settings.botSettings.color)
                    .setTitle(`${item.shortName} Barters`)
                    .setDescription(`[Wiki Link](${item.wikiLink})\nNo Barters`)
            ]
        }
    }
    return {
        embeds: [
            new MessageEmbed()
                .setThumbnail(ItemImage(item.id))
                .setColor(settings.botSettings.color)
                .setTitle(`${item.shortName} Barters`)
                .setDescription(`[Wiki Link](${item.wikiLink})`)
                .setFields(barterData.Barters.slice(0, 18))
        ]
    }
}

/*
    Data for command
*/

class BaterData {
    private barters: Barter[]
    private item: Item

    constructor(id: string) {
        this.item = GetItem(id)
        this.barters = GetBarter(id)
    }
    get Barters() {
        let message: EmbedFieldData[] = new Array()

        this.barters.forEach((barter, i) => {
            let barterTotal = 0
            const requiredItems = barter.requiredItems.map(({ item, count }) => {
                barterTotal += item.lastLowPrice * count
                const itemExtras = GetItem(item.id)
                return `x**${count}** - [${item.shortName}](${item.wikiLink} "${item.name}") - ${FormatPrice(itemExtras.lastLowPrice * count)}`
            })
            message.push(
                {
                    name: `Barter #${i + 1}`,
                    value: '\u200b',
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: `From: ${barter.source}`,
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Items',
                    value: requiredItems.join('\n'),
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Flea Market Price',
                    value: FormatPrice(this.item.lastLowPrice),
                    inline: true
                },
                {
                    name: 'Barter Total',
                    value: FormatPrice(barterTotal),
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Barter Profit',
                    value: FormatPrice(this.item.lastLowPrice - barterTotal),
                    inline: true
                }
            )
        })

        return message
    }
}
