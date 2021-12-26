import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { AutocompleteInteraction, CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js'
import SearchEngine from '../helpers/search_engines/item-engine'
import { ErrorReponse, FormatPrice, GetBarter, GetItem, isID, isShortName, ItemImage } from '../lib'
import settings from '../data/settings'

@Discord()
export class BarterCommand {
    @Slash('barter', { description: 'Calculates the price and profit of a specified barter' })
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
                        ErrorReponse('Please use the auto complete function to complete your search', 'barter')
                    )
                    return
                }
            }
            interaction.reply(this.message(id))
        } catch {
            interaction.reply(ErrorReponse('There was an unknown error executing this command', 'barter'))
        }
    }

    message(id: string) {
        const item = GetItem(id)
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
}

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
                return `x**${count}** - [${item.shortName}](${item.wikiLink} "${item.name}") - ${FormatPrice(
                    itemExtras.lastLowPrice * count
                )}`
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
