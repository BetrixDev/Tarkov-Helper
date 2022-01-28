import { CommandInteraction, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { Cache, ErrorReponse, FormatNumber, ReadJson, THEmbed } from '../lib'

type EXP = { fromPrevious: number; total: number }

let levelData: { exp: number }[] = ReadJson<any>('game_data/database/globals.json').config.exp.level.exp_table

function ExperienceData(): EXP[] {
    let total = 0
    let table: EXP[] = new Array()

    levelData.forEach((level: { exp: number }) => {
        total += level.exp
        table.push({ fromPrevious: level.exp, total })
    })

    return table
}

let MaxLevel = levelData.length

@Discord()
export abstract class Command {
    @Slash('xpto', {
        description: 'Calculate the experience needed to reach a certain levelm'
    })
    async xpto(
        @SlashOption('current', {
            description: 'Current Level. Can also be Experience Amount'
        })
        current: number,
        @SlashOption('end', {
            description: 'Level to end at'
        })
        end: number,
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.message(interaction, current, end))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(interaction: CommandInteraction, current: number, end: number) {
        const data = ExperienceData()

        if (current <= MaxLevel && end <= MaxLevel && current != end) {
            // 'current' value is level
            return {
                embeds: [
                    new THEmbed()
                        .setTitle('Experience Calculator')
                        .setThumbnail(Cache.config.images.thumbnails.experience)
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
                    new THEmbed()
                        .setTitle('Experience Calculator')
                        .setThumbnail(Cache.config.images.thumbnails.experience)
                        .addField(
                            `Experience Gap from ${current}xp to ${end}`,
                            FormatNumber(Math.abs(current - data[end - 1].total)) + 'xp'
                        )
                ]
            }
        } else if (current == end) {
            return ErrorReponse('Both level values are the same', interaction)
        } else {
            return ErrorReponse('There was an error the level values inputed', interaction)
        }
    }
}
