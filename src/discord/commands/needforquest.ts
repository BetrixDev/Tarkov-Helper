import 'reflect-metadata'
import settings from '../../data/bot/settings'
import { Discord, Slash, SlashOption } from 'discordx'
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { GetItem, ItemImage, ItemSearchMessage, ReadJson, ResolveStrings, SearchEngine } from '../../Lib'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('needforquest', {
        description: 'Shows if the specified item is needed for quests and how'
    })
    async quest(
        @SlashOption('item', {
            description: 'Item to show dependencies for',
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
    return new Promise<InteractionReplyOptions>(async (respond, error) => {
        const result = SearchEngine(args.item)
        let item: Item = args.item

        if (result.results.length > 1) {
            return ItemSearchMessage(args, result.results, {
                command: 'price',
                variable: 'item',
                args,
                interaction
            })
        } else if (result.error) {
            return {
                embeds: [result.error],
                ephemeral: true
            }
        } else {
            item = GetItem(result.results[0].id)
        }

        const dependencies = GetDependencies(item)

        respond({
            embeds: [
                new MessageEmbed()
                    .setColor(settings.botSettings.color)
                    .setTitle(`Quest Dependencies for ${item.shortName}`)
                    .setThumbnail(ItemImage(item.id))
                    .setDescription(
                        `
                    [Wiki Link](${item.wikiLink})
                    ${item.shortName} if needed for the following quests:
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
        })

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}

/*
    Data for command
*/

function GetDependencies(item: Item) {
    const questData: TrackerQuest[] = ReadJson('./src/data/game/api/questdata.json')

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
