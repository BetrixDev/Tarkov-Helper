import {
    ButtonInteraction,
    CommandInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton,
    MessageEmbed
} from 'discord.js'
import { ButtonComponent, Discord, Slash, SlashOption } from 'discordx'
import { container, injectable } from 'tsyringe'
import settings from '../data/settings'
import { Cache, ErrorReponse, FormatPrice, ResolveStrings } from '../lib'

@Discord()
class PricePerSlotCommand {
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
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.message(interaction, minimum, maximum))
        } catch {
            interaction.reply(ErrorReponse('There was an unknown error executing this command', 'priceperslot'))
        }
    }

    message(interaction: CommandInteraction, minimum: number, maximum: number): InteractionReplyOptions {
        const validItems = this.getValidItems(minimum, maximum)

        if (validItems.length == 0) {
            return ErrorReponse('No items were found in the specified priceperslot range', 'priceperslot')
        } else if (validItems.length > 999) {
            return ErrorReponse(
                `Too many items were found within the specified range *(${validItems.length})*`,
                'priceperslot'
            )
        }

        return this.getMessage(validItems, 0, minimum, maximum)
    }

    @ButtonComponent(/^priceperslot__/)
    async mapButton(interaction: ButtonInteraction) {
        const [_, method, p, minimum, maximum, date] = interaction.customId.split('__')

        let page = Number(p)
        if (method === 'b') page--
        else page++

        const validItems = this.getValidItems(Number(minimum), Number(maximum))

        interaction.update(this.getMessage(validItems, Number(page), Number(minimum), Number(maximum)))
    }

    getMessage(validItems: Item[], page: number, minimum: number, maximum: number) {
        const totalPages = Math.ceil(validItems.length / 15)
        const displayedPortion = this.getDisplayedItems(validItems, page)

        return {
            embeds: [
                new MessageEmbed()
                    .setColor(settings.botSettings.color)
                    .setThumbnail(settings.images.thumbnails.priceperslot)
                    .setTitle(`Price Per Slot Range: ${FormatPrice(minimum)} - ${FormatPrice(maximum)}`)
                    .addFields(
                        ResolveStrings([
                            {
                                name: `Items (${validItems.length})`,
                                value: displayedPortion
                                    .map((item, i) => {
                                        const priceperslot = Math.round(item.lastLowPrice / (item.width * item.height))
                                        return `\`${i + 1 + page * 15}\` - ${FormatPrice(priceperslot)} - ${item.name}`
                                    })
                                    .join('\n')
                            }
                        ])
                    )
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setCustomId(`priceperslot__b__${page}__${minimum}__${maximum}`)
                        .setLabel('Previous')
                        .setStyle('PRIMARY')
                        .setDisabled(page == 0),
                    new MessageButton()
                        .setCustomId(`priceperslot__pagecount`)
                        .setLabel(`${page + 1}/${totalPages}`)
                        .setStyle('SECONDARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`priceperslot__f__${page}__${minimum}__${maximum}`)
                        .setLabel('Next')
                        .setStyle('PRIMARY')
                        .setDisabled(page + 1 == totalPages)
                ])
            ]
        }
    }

    getDisplayedItems(validItems: Item[], page: number) {
        const totalPages = Math.ceil(validItems.length / 15)

        return validItems
            .sort((a, b) => {
                return b.lastLowPrice - a.lastLowPrice
            })
            .slice(page * 15, (page + 1) * 15)
    }

    getValidItems(minimum: number, maximum: number) {
        let validItems: Item[] = []

        const ItemData = Cache.itemData

        for (let i = 0; i < ItemData.length; i++) {
            try {
                const item = ItemData[i]

                const pricePerSlot = item.lastLowPrice / (item.width * item.height)

                if (pricePerSlot > minimum && pricePerSlot < maximum) validItems.push(item)
            } catch {}
        }

        return validItems
    }
}
