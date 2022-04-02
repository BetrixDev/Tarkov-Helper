import 'reflect-metadata'
import {
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    EmbedFieldData,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    SelectMenuInteraction
} from 'discord.js'
import { ButtonComponent, Client, Discord, SelectMenuComponent, Slash, SlashOption } from 'discordx'
import { fetchData, itemIdFromString } from '../Cache'
import { Barter } from '../lib/game/Barter'
import { Item } from '../lib/game/Item'
import { getItemFields, getStatImage } from '../helpers/item_command_classes/GameStats'
import { QuestStats } from '../helpers/item_command_classes/QuestStats'
import { autoCompleteResults } from '../lib/search_engines/ItemEngine'
import {
    capitalizeWords,
    formatNumber,
    formatPrice,
    getItemImage,
    handleCommandInteraction,
    THEmbed,
    translation
} from '../Lib'
import { HideoutModule } from '../types/game/Hideout'

type MenuActions = 'general' | 'game' | 'price' | 'barter'

export enum ErrorMessages {
    USE_AUTO_COMPLETE = 'Please use the auto complete function to complete your search'
}

@Discord()
export abstract class ItemCommand {
    @SelectMenuComponent(/^itemmenu/)
    async itemMenu(interaction: SelectMenuInteraction) {
        const [, l, id] = interaction.customId.split('__')
        const action = interaction.values[0] as MenuActions
        const language = l as Languages

        try {
            if (action === 'price') {
                interaction.update(ItemCommand.priceMessage(id, language))
            } else if (action === 'barter') {
                interaction.update(ItemCommand.barterMessage(id, language))
            } else if (action === 'game') {
                interaction.update(ItemCommand.statsMessage(id, language))
            } else {
                interaction.update(ItemCommand.message(id, language))
            }
        } catch {
            interaction.update(ItemCommand.message(id, language))
        }
    }

    @ButtonComponent(/^itembarter__/)
    async button(interaction: ButtonInteraction) {
        const [, l, action, id, p, m] = interaction.customId.split('__')
        const page = Number(p)
        const language = l as Languages
        const useMenu = m === 'yes'

        try {
            if (action === 'b') {
                interaction.update(ItemCommand.barterMessage(id, language, page - 1, useMenu))
            } else {
                interaction.update(ItemCommand.barterMessage(id, language, page + 1, useMenu))
            }
        } catch {
            interaction.update(ItemCommand.barterMessage(id, language, 0, useMenu))
        }
    }

    @Slash('item', { description: 'Retrieve all kinds of information about an item' })
    async item(
        @SlashOption('item', {
            description: 'item to get info of (start typing to search)',
            type: 'STRING',
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction)
        })
        id: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                try {
                    respond(ItemCommand.message(id, Language))
                } catch (e) {
                    error(e)
                }
            })
        )
    }

    static message(input: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        // Make sure item is a real item
        const id = itemIdFromString(input)
        if (!id) throw new Error(t(ErrorMessages.USE_AUTO_COMPLETE))

        const item = new Item(id, language)
        const barterData = new Barter(item.id, language)
        const questData = new QuestStats(item)

        let desc = `
            [Wiki Link](${item.wikiLink})
            "${item.description.length < 150 ? item.description : item.description.slice(0, 150).concat('...')}"
        `

        const quests = questData.getDependents()

        if (quests.length > 0) {
            desc = `
                ${desc}
                ${t('{0} is needed for the following quests:', item.shortName)}
                ${quests
                    .map((q) => `**${q.quest}** - **${formatNumber(q.count)}** time${q.count > 1 ? 's' : ''}`)
                    .join('\n')}
                \n
            `
        }

        let fields: EmbedFieldData[] = []

        if (item.props.CanSellOnRagfair === true) {
            fields.push({
                name: t('Price on Flea'),
                value: formatPrice(item.priceData.lastLowPrice ?? 0),
                inline: true
            })
        } else {
            fields.push({ name: t('Price on Flea'), value: t("Can't be sold"), inline: true })
        }

        let highestSell = item.sellingPrice()
        if (highestSell) {
            fields.push({
                name: t('Highest Selling Price'),
                value: formatPrice(highestSell.price, highestSell.source),
                inline: true
            })
        } else {
            fields.push({
                name: t('Highest Selling Price'),
                value: t("Can't be sold"),
                inline: true
            })
        }

        const lowestBuy = item.buyingPrice()
        if (lowestBuy) {
            fields.push({
                name: t('Lowest Buying Price'),
                value: formatPrice(lowestBuy.price, lowestBuy.source),
                inline: true
            })
        } else {
            fields.push({
                name: t('Lowest Buying Price'),
                value: t("Can't be bought"),
                inline: true
            })
        }

        let hideoutRequirement = 0
        fetchData<HideoutModule[]>('hideoutData').forEach((module) => {
            module.itemRequirements.forEach((i) => {
                if (i.item.id === id) {
                    hideoutRequirement += i.count
                }
            })
        })

        fields.push({
            name: t('Needed for hideout'),
            value: hideoutRequirement > 0 ? formatNumber(hideoutRequirement) : t('None'),
            inline: true
        })

        const carryLimit = item.inRaidCarryLimit
        fields.push({
            name: t('Carry Limit'),
            value: carryLimit ? carryLimit.toString() : t('None'),
            inline: true
        })

        if (barterData.barters.length > 0) {
            let barterCost = 0
            barterData.barters[0].requiredItems.forEach((i: any) => {
                barterCost += i.item.priceData.lastLowPrice * i.count
            })

            fields.push({
                name: t('Cheapest Barter'),
                value: `${formatPrice(barterCost)} from ${capitalizeWords(barterData.barters[0].source)}`,
                inline: true
            })
        } else {
            fields.push({
                name: t('Cheapest Barter'),
                value: t('No barters'),
                inline: true
            })
        }

        fields.push({ name: '\u200b', value: '\u200b', inline: true })

        if (questData.questRewards.length > 0) {
            let questText = questData.questRewards
                .sort((a, b) => b.count - a.count)
                .map((quest) => {
                    return t('**{0}** from {1}', formatNumber(quest.count), quest.name)
                })
                .join('\n')

            if (questText.length < 300) {
                fields.push({
                    name: t('Obtained from quests'),
                    value: questText,
                    inline: true
                })
            } else {
                questText = questData.questRewards.map((quest) => quest.name).join('\n')

                if (questText.length < 300) {
                    fields.push({
                        name: t('Obtained from quests'),
                        value: questText,
                        inline: true
                    })
                } else {
                    fields.push({
                        name: t('Obtained from quests'),
                        value: t('**Alot of quests** (*{0} quests*)', questData.questRewards.length),
                        inline: true
                    })
                }
            }
        }

        return {
            embeds: [
                new THEmbed()
                    .setTitle(t('{0} Information', item.shortName))
                    .setDescription(desc)
                    .setFields(fields)
                    .setThumbnail(getItemImage(id))
            ],
            components: [menu(language, id, 'general')]
        }
    }

    static statsMessage(id: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        const item = new Item(id, language)
        const itemFields = getItemFields(item, t)

        const fields: EmbedFieldData[] =
            itemFields.length > 0 ? itemFields : [{ name: '\u200b', value: 'No special stats', inline: true }]

        return {
            embeds: [
                new THEmbed()
                    .setTitle(t('{0} Stats', item.shortName))
                    .setDescription(
                        `
                            ${t('[Wiki Link]({0})', item.wikiLink)}
                            ${item.description}
                        `
                    )
                    .setThumbnail(getItemImage(id))
                    .addFields(fields)
                    .setImage(getStatImage(item).url)
            ]
        }
    }

    static barterMessage(id: string, language: Languages, page = 0, useMenu = true): InteractionReplyOptions {
        const t = translation(language)

        const item = new Item(id, language)
        const barterData = new Barter(id, language)

        const pages = barterData.barters.length

        const fields: EmbedFieldData[] = []

        fields.push(
            barterData.barterDependents.length > 0
                ? {
                    name: t('Used in barters'),
                    value: barterData.barterDependents.map((d) => t('**x{0}** in {1}', d.count, d.name)).join('\n'),
                    inline: true
                }
                : {
                    name: t('Used in barters'),
                    value: t('None'),
                    inline: true
                }
        )

        if (pages === 0) {
            return {
                embeds: [
                    new THEmbed()
                        .setThumbnail(getItemImage(item.id))
                        .setTitle(`${item.shortName} Barters`)
                        .setDescription(`${t('[Wiki Link]({0})', item.wikiLink)}\n${t('No Barters')}`)
                        .addFields(fields)
                ],
                components: useMenu ? [menu(language, id, 'barter')] : []
            }
        }

        let msg: InteractionReplyOptions = {
            embeds: [
                new THEmbed()
                    .setThumbnail(getItemImage(item.id))
                    .setTitle(`${item.shortName} Barters`)
                    .setDescription(`[Wiki Link](${item.wikiLink})`)
                    .setFields(...barterData.barterMessage.slice(page * 9, page * 9 + 9), ...fields)
            ],
            components: useMenu ? [menu(language, id, 'barter')] : []
        }

        if (barterData.barters.length > 1) {
            msg.components = [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`itembarter__${language}__b__${id}__${page}__${useMenu ? 'yes' : ''}`)
                        .setLabel('Last Barter')
                        .setDisabled(page === 0)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId(`itembarter__${language}__f__${id}__${page}__${useMenu ? 'yes' : ''}`)
                        .setLabel('Next Barter')
                        .setDisabled(page === pages - 1)
                        .setStyle('PRIMARY')
                ),
                ...(useMenu ? [menu(language, id, 'barter')] : [])
            ]
        }

        return msg
    }

    static priceMessage(id: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        const item = new Item(id, language)

        const buyingPrices = item.priceData.buyFor
            .sort((a, b) => a.price - b.price)
            .map((offer) => {
                return { source: capitalizeWords(offer.source), price: formatPrice(offer.price, offer.source) }
            })
        const sellingPrices = item.priceData.sellFor
            .sort((a, b) => b.price - a.price)
            .map((offer) => {
                return { source: capitalizeWords(offer.source), price: formatPrice(offer.price, offer.source) }
            })

        if (item.priceData.avg24hPrice === 0) {
            return {
                embeds: [
                    new THEmbed()
                        .setTitle(t('{0} Price Data', item.shortName))
                        .setThumbnail(getItemImage(id))
                        .setDescription(
                            `
                           ${t('[Wiki Link]({0})', item.wikiLink)}
                           ${t('**This item has no offers on the Flea Market**')}
                        `
                        )
                        .addFields(
                            sellingPrices.length > 0
                                ? {
                                    name: t('Best Sells'),
                                    value: t('{0} at {1}/each', sellingPrices[0].source, sellingPrices[0].price)
                                }
                                : { name: '\u200b', value: '\u200b' }
                        )
                ]
            }
        } else {
            return {
                embeds: [
                    new THEmbed()
                        .setTitle(
                            t('{0} Price Data - {1}', item.shortName, formatPrice(item.priceData.lastLowPrice ?? 0))
                        )
                        .setDescription(t('[Wiki Link]({0})', item.wikiLink))
                        .setThumbnail(getItemImage(id))
                        .addFields(
                            {
                                name: t('Price Right Now'),
                                value: formatPrice(item.priceData.lastLowPrice ?? 0),
                                inline: true
                            },
                            {
                                name: t('Price Per Slot'),
                                value: formatPrice(item.pricePerSlot),
                                inline: true
                            },
                            {
                                name: t('Avg 24hr Price'),
                                value: `${formatPrice(item.priceData.avg24hPrice)} (${item.priceData.changeLast48hPercent
                                    }%)`,
                                inline: true
                            },
                            {
                                name: t('Best Sell'),
                                value:
                                    sellingPrices.length > 1
                                        ? // Show if the item can be sold in multiple places
                                        t(
                                            '**{0}** at **{1}**/each or {2} at {3}/each',
                                            sellingPrices[0].source,
                                            sellingPrices[0].price,
                                            sellingPrices[1].source,
                                            sellingPrices[1].price
                                        )
                                        : // Show if the item can only be sold at one place
                                        t('**{0}** at **{1}**/each', sellingPrices[0].source, sellingPrices[0].price),
                                inline: true
                            },
                            {
                                name: t('Best Buys'),
                                value: t('{0} at {1}', buyingPrices[0].source, buyingPrices[0].price),
                                inline: true
                            }
                        )
                ],
                components: [menu(language, id, 'price')]
            }
        }
    }
}

function menu(language: Languages, id: string, currentMessage: MenuActions) {
    const t = translation(language)

    return new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId(`itemmenu__${language}__${id}`)
            .setPlaceholder(t('Select a Catagorey'))
            .setOptions(
                {
                    label: t('General Stats'),
                    value: 'general',
                    description: t('Basic stats of all catagories'),
                    default: currentMessage === 'general'
                },
                {
                    label: t('Game Stats'),
                    value: 'game',
                    description: t('Stats about how the item functions in game'),
                    default: currentMessage === 'game'
                },
                {
                    label: t('Price Stats'),
                    value: 'price',
                    description: t('Price stats about the item'),
                    default: currentMessage === 'price'
                },
                {
                    label: t('Barter Stats'),
                    value: 'barter',
                    description: t('Find how much barters for this item cost'),
                    default: currentMessage === 'barter'
                }
            )
    )
}
