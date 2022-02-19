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
import {
    isID,
    isShortName,
    ErrorReponse,
    THEmbed,
    GetItem,
    ItemImage,
    FormatPrice,
    Cache,
    FormatNumber,
    LowestPrice,
    CapitalizeWords,
    ResolveStrings
} from '../lib'
import { ButtonComponent, Discord, SelectMenuComponent, Slash, SlashOption } from 'discordx'
import { BaterData } from '../helpers/item_classes/barter-stats'
import { GameStats } from '../helpers/item_classes/game-stats'
import SearchEngine from '../helpers/search_engines/item-engine'
import { PriceData } from '../helpers/item_classes/price-stats'
import { QuestStats } from '../helpers/item_classes/quest-stats'

type MenuActions = 'general' | 'game' | 'price' | 'barter'

@Discord()
export abstract class ItemCommand {
    @Slash('item', { description: 'Retrieve all kinds of information about an item' })
    async item(
        @SlashOption('item', {
            description: 'item to get info of (start typing to search)',
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

    @SelectMenuComponent(/^itemmenu__/)
    async menuInteraction(interaction: SelectMenuInteraction) {
        try {
            const [_, id] = interaction.customId.split('__')
            const action = interaction.values[0] as MenuActions

            if (action === 'general') {
                interaction.update(this.message(id))
            } else if (action === 'barter') {
                interaction.update(this.barterMessage(id, 0))
            } else if (action === 'game') {
                interaction.update(this.statsMessage(id))
            } else if (action === 'price') {
                interaction.update(this.priceMessage(id))
            }
        } catch (e) {
            console.log(e)
        }
    }

    @ButtonComponent(/^itembarter__/)
    async button(interaction: ButtonInteraction) {
        try {
            const [_, action, id, p] = interaction.customId.split('__')
            const page = Number(p)

            if (action == 'b') {
                interaction.update(this.barterMessage(id, page - 1))
            } else {
                interaction.update(this.barterMessage(id, page + 1))
            }
        } catch (e) {
            console.log(e)
        }
    }

    priceMessage(id: string): InteractionReplyOptions {
        const item = GetItem(id)
        const priceData = new PriceData(item)

        const sellPrices = priceData.sellingPrices
        const buyPrices = priceData.buyingPrices

        if (item.avg24hPrice === 0) {
            return {
                embeds: [
                    new THEmbed()
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
                ],
                components: [this.menu(id, 'price')]
            }
        } else {
            return {
                embeds: [
                    new THEmbed()
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
                                    value: FormatPrice(priceData.pricePerSlot()),
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
                ],
                components: [this.menu(id, 'price')]
            }
        }
    }

    statsMessage(id: string): InteractionReplyOptions {
        const item = GetItem(id)

        const itemData = new GameStats(item)
        const messageData = itemData.specificData
        const fields = messageData.fields || [{ name: '\u200b', value: 'No special stats', inline: true }]

        return {
            embeds: [
                new THEmbed()
                    .setTitle(`${item.shortName} Stats`)
                    .setDescription(
                        `
                            [Wiki Link](${item.wikiLink})
                            ${itemData.description}
                        `
                    )
                    .setThumbnail(ItemImage(item.id))
                    .addFields(ResolveStrings(fields))
                    .setImage(messageData.image?.url ?? '')
                    .setFooter(messageData.footer?.text ?? '')
            ],
            components: [this.menu(id, 'game')]
        }
    }

    barterMessage(id: string, page = 0): InteractionReplyOptions {
        const item = GetItem(id)
        const barterData = new BaterData(id)

        const pages = barterData.barters.length

        const fields: EmbedFieldData[] = []

        if (barterData.barterDependents.length > 0) {
            fields.push({
                name: 'Used in barters',
                value: barterData.barterDependents
                    .map((dependent) => {
                        return `**x${dependent.count}** in ${dependent.name}`
                    })
                    .join('\n'),
                inline: true
            })
        } else {
            fields.push({
                name: 'Used in barters',
                value: 'None',
                inline: true
            })
        }

        if (pages === 0) {
            return {
                embeds: [
                    new THEmbed()
                        .setThumbnail(ItemImage(item.id))
                        .setTitle(`${item.shortName} Barters`)
                        .setDescription(`[Wiki Link](${item.wikiLink})\nNo Barters`)
                        .addFields(fields)
                ],
                components: [this.menu(id, 'barter')]
            }
        }

        let msg: InteractionReplyOptions = {
            embeds: [
                new THEmbed()
                    .setThumbnail(ItemImage(item.id))
                    .setTitle(`${item.shortName} Barters`)
                    .setDescription(`[Wiki Link](${item.wikiLink})`)
                    .setFields(...barterData.message.slice(page * 9, page * 9 + 9), ...fields)
            ],
            components: [this.menu(id, 'barter')]
        }

        if (barterData.barters.length > 1) {
            msg.components = [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`itembarter__b__${id}__${page}`)
                        .setLabel('Last Barter')
                        .setDisabled(page === 0)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId(`itembarter__f__${id}__${page}`)
                        .setLabel('Next Barter')
                        .setDisabled(page === pages - 1)
                        .setStyle('PRIMARY')
                ),
                this.menu(id, 'barter')
            ]
        }

        return msg
    }

    message(id: string): InteractionReplyOptions {
        const item = GetItem(id)
        const gameData = new GameStats(item)
        const barterData = new BaterData(id)
        const questData = new QuestStats(item)

        let desc = `
            [Wiki Link](${item.wikiLink})
            ${gameData.description}
        `

        let quests: { quest: string; count: number }[] = []

        Cache.questData.forEach((quest) => {
            if (quest.objectives) {
                quest.objectives.forEach((objective) => {
                    if (objective.target === id) {
                        quests.push({ quest: quest.title, count: objective.number })
                    }
                })
            }
        })

        if (quests.length > 0) {
            desc = `
                ${desc}
                ${item.shortName} is needed for the following quests:
                ${quests
                    .map((q) => `**${q.quest}** - **${FormatNumber(q.count)}** time${q.count > 1 ? 's' : ''}`)
                    .join('\n')}
                \n
            `
        } else {
            desc = `
                ${desc}
                ${item.shortName} isn't needed for any quests
                \n
            `
        }

        let fields: EmbedFieldData[] = []

        if (gameData.itemData.raw.CanSellOnRagfair) {
            fields.push({ name: 'Price on Flea', value: FormatPrice(item.lastLowPrice), inline: true })
        } else {
            fields.push({ name: 'Price on Flea', value: "Can't be sold", inline: true })
        }

        if (item.sellFor.length > 0) {
            const highestSell = item.sellFor.sort((a, b) => {
                return b.price - a.price
            })[0]
            fields.push({
                name: 'Highest Selling Price',
                value: FormatPrice(highestSell.price, highestSell.source),
                inline: true
            })
        } else {
            fields.push({
                name: 'Highest Selling Price',
                value: "Can't be sold",
                inline: true
            })
        }

        const lowestBuy = LowestPrice(item)
        fields.push({
            name: 'Lowest Buying Price',
            value: lowestBuy?.price === undefined ? "Can't be bought" : FormatPrice(lowestBuy.price, lowestBuy.source),
            inline: true
        })

        let hideoutRequirement = 0
        Cache.hideoutData.forEach((module) => {
            module.itemRequirements.forEach(({ item, count }) => {
                if (item.id === id) {
                    hideoutRequirement += count
                }
            })
        })
        fields.push({
            name: 'Needed for hideout',
            value: hideoutRequirement > 0 ? FormatNumber(hideoutRequirement) : 'None',
            inline: true
        })

        if (barterData.barters.length > 0) {
            let barterCost = 0
            barterData.barters[0].requiredItems.forEach((barter) => {
                barterCost += barter.count * LowestPrice(barter.item).price
            })
            fields.push({
                name: 'Cheapest Barter',
                value: `${FormatPrice(barterCost)} from ${CapitalizeWords(barterData.barters[0].source)}`,
                inline: true
            })
        } else {
            fields.push({
                name: 'Cheapest Barter',
                value: 'No barters',
                inline: true
            })
        }

        fields.push({ name: '\u200b', value: '\u200b', inline: true })

        // Some basic checks so that we can give the most amount of information without exceeding the character limit for a field (max: 1024)
        if (questData.questRewards.length > 0) {
            let questText = questData.questRewards
                .sort((a, b) => b.count - a.count)
                .map((quest) => {
                    return `**${FormatNumber(quest.count)}** from ${quest.name}`
                })
                .join('\n')

            if (questText.length < 300) {
                fields.push({
                    name: 'Obtained from quests',
                    value: questText,
                    inline: true
                })
            } else {
                questText = questData.questRewards.map((quest) => quest.name).join('\n')

                if (questText.length < 300) {
                    fields.push({
                        name: 'Obtained from quests',
                        value: questText,
                        inline: true
                    })
                } else {
                    fields.push({
                        name: 'Obtained from quests',
                        value: `**Alot of quests** (*${questData.questRewards.length} quests*)`,
                        inline: true
                    })
                }
            }
        }

        return {
            embeds: [
                new THEmbed()
                    .setTitle(`${item.shortName} Information`)
                    .setDescription(desc)
                    .setThumbnail(ItemImage(id))
                    .setFields(fields)
                    .setFooter('Use the menu below for more information')
            ],
            components: [this.menu(id, 'general')]
        }
    }

    menu(id: string, currentMessage: MenuActions) {
        return new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`itemmenu__${id}`)
                .setPlaceholder('Select a Catagorey')
                .setOptions(
                    {
                        label: 'General Stats',
                        value: 'general',
                        description: 'Basic stats of all catagories',
                        default: currentMessage === 'general'
                    },
                    {
                        label: 'Game Stats',
                        value: 'game',
                        description: 'Stats about how the item functions in game',
                        default: currentMessage === 'game'
                    },
                    {
                        label: 'Price Stats',
                        value: 'price',
                        description: 'Price stats about the item',
                        default: currentMessage === 'price'
                    },
                    {
                        label: 'Barter Stats',
                        value: 'barter',
                        description: 'Find how much barters for this item cost',
                        default: currentMessage === 'barter'
                    }
                )
        )
    }
}
