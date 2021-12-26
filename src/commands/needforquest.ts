import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from 'discord.js'
import { ErrorReponse, GetItem, isID, ItemImage, ReadJson, ResolveStrings } from '../lib'
import settings from '../data/settings'
import SearchEngine from '../helpers/search_engines/item-engine'

@Discord()
export class NeedforQuestCommand {
    @Slash('needforquest', {
        description: 'Shows if the specified item is needed for quests and how'
    })
    async quest(
        @SlashOption('item', {
            description: 'Item to show dependencies for',
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
                interaction.reply(
                    ErrorReponse('Please use the auto complete function to complete your search', 'needforquest')
                )
                return
            }

            interaction.reply(this.message(id))
        } catch {
            interaction.reply(ErrorReponse('There was an unknown error executing this command', 'needforquest'))
        }
    }

    message(id: string) {
        const item = GetItem(id)
        const dependencies = GetDependencies(item)

        return {
            embeds: [
                new MessageEmbed()
                    .setColor(settings.botSettings.color)
                    .setTitle(`Quest Dependencies for ${item.shortName}`)
                    .setThumbnail(ItemImage(item.id))
                    .setDescription(
                        `
                    [Wiki Link](${item.wikiLink})
                    ${item.shortName} is needed for the following quests:
                    ${dependencies.usedQuests.join('\n')}
                    `
                    )
                    .addFields(
                        ResolveStrings([
                            {
                                name: 'Find in Raid',
                                value: dependencies.fir,
                                inline: true
                            },
                            {
                                name: 'Non FIR',
                                value: dependencies.collect,
                                inline: true
                            },
                            {
                                name: 'Amount to Place',
                                value: dependencies.place,
                                inline: true
                            }
                        ])
                    )
            ]
        }
    }
}

function GetDependencies(item: Item) {
    const questData: TrackerQuest[] = ReadJson('./game_data/api/questdata.json')

    let usedQuests: string[] = []
    let fir = 0
    let collect = 0
    let place = 0

    questData.forEach((quest) => {
        if (quest.objectives) {
            quest.objectives.forEach((objective) => {
                if (objective.target === item.id) {
                    usedQuests.push(`**${quest.title}**`)
                    if (objective.type === 'find') {
                        fir += objective.number
                    }
                    if (objective.type === 'collect') {
                        collect += objective.number
                    }
                    if (objective.type === 'place') {
                        place += objective.number
                    }
                }
            })
        }
    })

    return { usedQuests, fir, collect, place }
}
