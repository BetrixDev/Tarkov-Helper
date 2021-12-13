import 'reflect-metadata'
import { Interaction, InteractionReplyOptions, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { Cache, ErrorMessage, FormatPrice } from '../../Lib'
import settings from '../../botConfig'
import { AppendCache } from '../../helpers/Cache'

/*
    Class for dealing with registering command
*/

@Discord()
abstract class Command {
    @Slash('priceperslot', {
        description: 'Returns all items within the specified price per slot value'
    })
    async priceperslot(
        @SlashOption('minimum', {
            description: 'Minimum price per slot',
            required: true
        })
        minimum: number,
        @SlashOption('maximum', {
            description: 'Maximum price per slot',
            required: true
        })
        maximum: number,
        interaction: Interaction
    ) {}
}

/*
    Message for command
*/

type Args = { minimum: number; maximum: number }
type Extras = { items: Item[]; page: number; date?: string }

export default async function Message(interaction: Interaction, args: Args, s: any, extras: Extras) {
    return new Promise<InteractionReplyOptions>(async (resolve, error) => {
        const { minimum, maximum } = args

        let validItems: Item[] = []

        if (extras !== undefined) {
            validItems = extras.items
        } else {
            const ItemData = Cache.itemData

            for (let i = 0; i < ItemData.length; i++) {
                try {
                    const item = ItemData[i]

                    const pricePerSlot = item.lastLowPrice / (item.width * item.height)

                    if (pricePerSlot > minimum && pricePerSlot < maximum) validItems.push(item)
                } catch {}
            }
        }

        if (validItems.length == 0) {
            return {
                embeds: [ErrorMessage('No items were found in the specified priceperslot range')],
                ephemeral: true
            }
        } else if (validItems.length > 999) {
            return {
                embeds: [ErrorMessage(`Too many items were found within the specified range *(${validItems.length})*`)],
                ephemeral: true
            }
        }

        const page = extras !== undefined ? extras.page : 0
        const totalPages = Math.ceil(validItems.length / 15)

        const displayedPortion = validItems
            .sort((a, b) => {
                return b.lastLowPrice - a.lastLowPrice
            })
            .slice(page * 15, (page + 1) * 15)

        const date = extras?.date ?? Date.now().toString()
        AppendCache(date, { interaction, page, minimum, maximum, items: validItems, date })

        resolve({
            embeds: [
                new MessageEmbed()
                    .setColor(settings.botSettings.color)
                    .setThumbnail(settings.images.thumbnails.priceperslot)
                    .setTitle(`Price Per Slot Range: ${FormatPrice(minimum)} - ${FormatPrice(maximum)}`)
                    .addFields({
                        name: `Items (${validItems.length})`,
                        value: displayedPortion
                            .map((item, i) => {
                                const priceperslot = Math.round(item.lastLowPrice / (item.width * item.height))
                                return `\`${i + 1 + page * 15}\` - ${FormatPrice(priceperslot)} - ${item.name}`
                            })
                            .join('\n')
                    })
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setCustomId(`priceperslot__${date}__backward`)
                        .setLabel('Previous')
                        .setStyle('PRIMARY')
                        .setDisabled(page == 0),
                    new MessageButton()
                        .setCustomId(`priceperslot__${date}__pagecount`)
                        .setLabel(`${page + 1}/${totalPages}`)
                        .setStyle('SECONDARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`priceperslot__${date}__forward`)
                        .setLabel('Next')
                        .setStyle('PRIMARY')
                        .setDisabled(page + 1 == totalPages)
                ])
            ]
        })

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}
