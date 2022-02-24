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
import { injectable } from 'tsyringe'
import { autoCompleteResults } from '../helpers/search_engines/item-engine'
import { fetchData, isId } from '../data/cache'
import { Item } from '../data/classes/item'
import { Barter } from '../data/classes/barter'
import { QuestStats } from '../helpers/item_classes/quest-stats'
import {
    capitalizeWords,
    formatNumber,
    formatPrice,
    getItemImage,
    handleCommandInteraction,
    THEmbed,
    translation
} from '../lib'
import { getItemFields, getStatImage } from '../helpers/item_classes/game-stats'

type MenuActions = 'general' | 'game' | 'price' | 'barter'

export enum ErrorMessages {
    USE_AUTO_COMPLETE = 'Please use the auto complete function to complete your search'
}

@Discord()
@injectable()
export class ItemCommand {
    @SelectMenuComponent(/^itemmenu/)
    async itemMenu(interaction: SelectMenuInteraction) {
        const [, l, id] = interaction.customId.split('__')
        const action = interaction.values[0] as MenuActions
        const language = l as Languages

        try {
            if (action === 'price') {
                interaction.update(this.priceMessage(id, language))
            } else if (action === 'barter') {
                interaction.update(this.barterMessage(id, language))
            } else if (action === 'game') {
                interaction.update(this.statsMessage(id, language))
            } else {
                interaction.update(this.message(id, language))
            }
        } catch {
            interaction.update(this.message(id, language))
        }
    }

    @ButtonComponent(/^itembarter__/)
    async button(interaction: ButtonInteraction) {
        const [, l, action, id, p] = interaction.customId.split('__')
        const page = Number(p)
        const language = l as Languages

        try {
            if (action === 'b') {
                interaction.update(this.barterMessage(id, language, page - 1))
            } else {
                interaction.update(this.barterMessage(id, language, page + 1))
            }
        } catch {
            interaction.update(this.barterMessage(id, language))
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
                    respond(this.message(id, Language))
                } catch (e) {
                    error(e)
                }
            })
        )
    }

    message(id: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        // Make sure item is a real item
        if (!isId(id)) throw new Error(t(ErrorMessages.USE_AUTO_COMPLETE))

        const item = new Item(id, language)
        const barterData = new Barter(item.id, language)
        const questData = new QuestStats(item)

        let desc = `
            [Wiki Link](${item.wikiLink})
            "*${item.description.length < 150 ? item.description : item.description.slice(0, 150).concat('...')}*"
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

        if (item.priceData.sellFor.length) {
            let highestSell = item.priceData.sellFor.sort((a, b) => {
                return b.price - a.price
            })[0]

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

        if (item.priceData.buyFor.length > 0) {
            const lowestBuy = item.priceData.buyFor.sort((a, b) => b.price - a.price)[0]
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
            components: [this.menu(language, id, 'general')]
        }
    }

    statsMessage(id: string, language: Languages): InteractionReplyOptions {
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

    barterMessage(id: string, language: Languages, page = 0): InteractionReplyOptions {
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
                        .setDescription(`[Wiki Link](${item.wikiLink})\nNo Barters`)
                        .addFields(fields)
                ],
                components: [this.menu(language, id, 'barter')]
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
            components: [this.menu(language, id, 'barter')]
        }

        if (barterData.barters.length > 1) {
            msg.components = [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`itembarter__${language}__b__${id}__${page}`)
                        .setLabel('Last Barter')
                        .setDisabled(page === 0)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId(`itembarter__${language}__f__${id}__${page}`)
                        .setLabel('Next Barter')
                        .setDisabled(page === pages - 1)
                        .setStyle('PRIMARY')
                ),
                this.menu(language, id, 'barter')
            ]
        }

        return msg
    }

    priceMessage(id: string, language: Languages): InteractionReplyOptions {
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
                        .addFields({
                            name: t('Best Sells'),
                            value: t('{0} at {1}/each', sellingPrices[0].source, sellingPrices[0].price)
                        })
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
                                value: `${formatPrice(item.priceData.avg24hPrice)} (${
                                    item.priceData.changeLast48hPercent
                                }%)`,
                                inline: true
                            },
                            {
                                name: t('Best Sells'),
                                value: t(
                                    '**{0}** at **{1}**/each or {2} at {3}/each',
                                    sellingPrices[0].source,
                                    sellingPrices[0].price,
                                    sellingPrices[1].source,
                                    sellingPrices[1].price
                                ),
                                inline: true
                            },
                            {
                                name: t('Best Buys'),
                                value: t('{0} at {1}', buyingPrices[0].source, buyingPrices[0].price),
                                inline: true
                            }
                        )
                ],
                components: [this.menu(language, id, 'price')]
            }
        }
    }

    menu(language: Languages, id: string, currentMessage: MenuActions) {
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
}
