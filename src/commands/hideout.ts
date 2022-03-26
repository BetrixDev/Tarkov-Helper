import 'reflect-metadata'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { autoCompleteResults } from '../helpers/search_engines/ModuleEngine'
import { formatNumber, formatPrice, handleCommandInteraction, THEmbed, translation } from '../Lib'
import { readFileSync } from 'jsonfile'
import { HideoutModule } from '../data/classes/Module'
import { Item } from '../data/classes/Item'

const HIDEOUT_MODULE_COUNT = readFileSync('./data/hideoutData.json').length as number

export enum ErrorMessages {
    USE_AUTO_COMPLETE = 'Please use the auto complete function to complete your search'
}

@Discord()
export abstract class HideoutCommand {
    @Slash('hideout', { description: 'Retrieve the cost for upgrading a hideout module' })
    async hideout(
        @SlashOption('module', {
            description: 'name of the module to grab. ex: "Bitcoin Farm"',
            type: 'STRING',
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction)
        })
        i: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                const id = Number(i)

                if (isNaN(id) || id > HIDEOUT_MODULE_COUNT) {
                    error(translation(Language)(ErrorMessages.USE_AUTO_COMPLETE))
                }

                respond(HideoutCommand.message(id, Language))
            })
        )
    }

    static message(id: number, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        const module = new HideoutModule(id, language)

        const requiredItems = module.data.itemRequirements.map((i) => {
            return { item: new Item(i.item.id, language), count: i.count }
        })

        return {
            embeds: [
                new THEmbed().setTitle(t('{0} Level {1} Upgrade Requirements', module.name, module.level)).addFields(
                    {
                        name: t('Items'),
                        value:
                            requiredItems.length > 0
                                ? requiredItems
                                    .map(
                                        ({ item, count }) =>
                                            `**x${formatNumber(count)}** [${item.shortName}](${item.wikiLink} "${item.name
                                            }") - ${formatPrice(item.buyingPrice()?.price ?? 0 * count)}`
                                    )
                                    .join('\n')
                                : t('None'),
                        inline: true
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                    },
                    {
                        name: t('Total Cost'),
                        value: formatPrice(module.upgradeCost),
                        inline: true
                    },
                    {
                        name: t('Required Modules'),
                        value:
                            module.data.moduleRequirements.length > 0
                                ? module.data.moduleRequirements
                                    .map(({ id, level }) =>
                                        t('{0} Level {1}', new HideoutModule(id, language).name, level)
                                    )
                                    .join('\n')
                                : t('None'),
                        inline: true
                    }
                )
            ]
        }
    }
}
