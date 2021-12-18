import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import settings from '../../data/bot/settings'
import { ErrorMessage, FormatNumber, ReadJson } from '../../Lib'

/*
    Data for command
*/

type EXP = { fromPrevious: number; total: number }

let levelData: { exp: number }[] = ReadJson('./src/data/game/database/globals.json').config.exp.level.exp_table

function ExperienceData(): EXP[] {
    const levelData = ReadJson('./src/data/game/database/globals.json').config.exp.level.exp_table

    let total = 0
    let table: EXP[] = new Array()

    levelData.forEach((level: { exp: number }) => {
        total += level.exp
        table.push({ fromPrevious: level.exp, total })
    })

    return table
}

let MaxLevel = levelData.length

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('xpto', {
        description: 'Calculate the experience needed to reach a certain levelm'
    })
    async xpto(
        @SlashOption('current', {
            description: 'Current Level. Can also be Experience Amount',
            required: true
        })
        current: number,
        @SlashOption('end', {
            description: 'Level to end at',
            required: true
        })
        end: number,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: { current: number; end: number }): Promise<InteractionReplyOptions> => {
    const { current, end } = args

    const data = ExperienceData()

    if (current <= MaxLevel && end <= MaxLevel && current != end) {
        // 'current' value is level
        return {
            embeds: [
                new MessageEmbed()
                    .setTitle('Experience Calculator')
                    .setColor(settings.botSettings.color)
                    .setThumbnail(settings.images.thumbnails.experience)
                    .addField(
                        `Experience Gap from ${current} to ${end}`,
                        `${FormatNumber(Math.abs(data[current - 1].total - data[end - 1].total))}xp`
                    )
            ]
        }
    } else if (current > MaxLevel && end <= MaxLevel) {
        // 'current' value is experience points
        return {
            embeds: [
                new MessageEmbed()
                    .setTitle('Experience Calculator')
                    .setColor(settings.botSettings.color)
                    .setThumbnail(settings.images.thumbnails.experience)
                    .addField(`Experience Gap from ${current}xp to ${end}`, FormatNumber(Math.abs(current - data[end - 1].total)) + 'xp')
            ]
        }
    } else if (current == end) {
        return {
            embeds: [ErrorMessage('Both level values are the same')],
            ephemeral: true
        }
    } else {
        return {
            embeds: [ErrorMessage('There was an error the level values inputed')],
            ephemeral: true
        }
    }
}
