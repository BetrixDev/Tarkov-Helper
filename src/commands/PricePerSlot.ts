import 'reflect-metadata'
import {
    ButtonInteraction,
    CommandInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton
} from 'discord.js'
import { ButtonComponent, Client, Discord, Slash, SlashOption } from 'discordx'
import { fetchData } from '../Cache'
import { TarkovToolsItem } from '../types/game/Item'
import { formatPrice, handleCommandInteraction, THEmbed, translation } from '../Lib'
import botConfig from '../config/BotConfig'
import { Item } from '../lib/game/Item'

@Discord()
export abstract class PricePerSlotCommand {
    @Slash('priceperslot', {
        description: 'Returns all items within the specified price per slot range'
    })
    async priceperslot(
        @SlashOption('minimum', {
            description: 'Minimum price per slot'
        })
        minimum: number,
        @SlashOption('maximum', {
            description: 'Maximum price per slot'
        })
        maximum: number,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                const t = translation(Language)

                const validItems = PricePerSlotCommand.getValidItems(minimum, maximum)

                if (validItems.length == 0) {
                    error(t('No items were found in the specified priceperslot range'))
                } else if (validItems.length > 999) {
                    error(t(`Too many items were found within the specified range ({0})`, validItems.length))
                }

                respond(PricePerSlotCommand.message(validItems, Language, 0, minimum, maximum))
            })
        )
    }

    @ButtonComponent(/^priceperslot__/)
    async mapButton(interaction: ButtonInteraction) {
        const [_, method, p, minimum, maximum, language] = interaction.customId.split('__')

        let page = Number(p)
        if (method === 'b') {
            page--
        } else {
            page++
        }

        const validItems = PricePerSlotCommand.getValidItems(Number(minimum), Number(maximum))

        interaction.update(
            PricePerSlotCommand.message(
                validItems,
                language as Languages,
                Number(page),
                Number(minimum),
                Number(maximum)
            )
        )
    }

    static message(
        validItems: TarkovToolsItem[],
        language: Languages,
        page: number,
        minimum: number,
        maximum: number
    ): InteractionReplyOptions {
        const totalPages = Math.ceil(validItems.length / 15)
        const displayedPortion = this.getDisplayedItems(validItems, page)

        const t = translation(language)

        return {
            embeds: [
                new THEmbed()
                    .setThumbnail(botConfig.images.thumbnails.priceperslot)
                    .setTitle(t(`Price Per Slot Range: {0}-{1}`, formatPrice(minimum), formatPrice(maximum)))
                    .addFields({
                        name: `Items (${validItems.length})`,
                        value: displayedPortion
                            .map((item, i) => {
                                const priceperslot = Math.round(
                                    (item.lastLowPrice ?? item.avg24hPrice) / (item.width * item.height)
                                )
                                return `\`${i + 1 + page * 15}\` - ${formatPrice(priceperslot)} - ${new Item(item.id, language).name
                                    }`
                            })
                            .join('\n')
                    })
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setCustomId(`priceperslot__b__${page}__${minimum}__${maximum}__${language}`)
                        .setLabel(t('Previous'))
                        .setStyle('PRIMARY')
                        .setDisabled(page == 0),
                    new MessageButton()
                        .setCustomId(`priceperslot__pagecount`)
                        .setLabel(`${page + 1}/${totalPages}`)
                        .setStyle('SECONDARY')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId(`priceperslot__f__${page}__${minimum}__${maximum}__${language}`)
                        .setLabel(t('Next'))
                        .setStyle('PRIMARY')
                        .setDisabled(page + 1 == totalPages)
                ])
            ]
        }
    }

    static getDisplayedItems(validItems: TarkovToolsItem[], page: number) {
        return validItems
            .sort((a, b) => {
                return (
                    (a.lastLowPrice ?? a.avg24hPrice) / (a.width * a.height) -
                    (b.lastLowPrice ?? b.avg24hPrice) / (b.width * b.height)
                )
            })
            .slice(page * 15, (page + 1) * 15)
    }

    static getValidItems(minimum: number, maximum: number) {
        let validItems: TarkovToolsItem[] = []

        const ItemData = fetchData<TarkovToolsItem[]>('itemData')

        for (let i = 0; i < ItemData.length; i++) {
            try {
                const item = ItemData[i]

                const pricePerSlot = (item.lastLowPrice ?? item.avg24hPrice) / (item.width * item.height)

                if (pricePerSlot > minimum && pricePerSlot < maximum) validItems.push(item)
            } catch { }
        }

        return validItems
    }
}
