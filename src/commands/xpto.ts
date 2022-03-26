import 'reflect-metadata'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { readFileSync } from 'jsonfile'
import { formatNumber, handleCommandInteraction, THEmbed, translation } from '../Lib'
import botConfig from '../config/BotConfig'

interface ExperiencePoint {
    fromPrevious: number
    total: number
}

const LEVEL_DATA: { exp: number }[] = readFileSync('./data/globals.json').config.exp.level.exp_table
const MAX_LEVEL = LEVEL_DATA.length

const getExperienceData = (): ExperiencePoint[] => {
    let total = 0
    let table: ExperiencePoint[] = []

    LEVEL_DATA.forEach(({ exp }) => {
        total += exp
        table.push({ fromPrevious: exp, total })
    })

    return table
}

const experienceData = getExperienceData()

@Discord()
export abstract class XptoCommand {
    @Slash('xpto', {
        description: 'Calculate the experience needed to reach a certain levelm'
    })
    async xpto(
        @SlashOption('current', {
            description: 'Current Level. Can also be experience Amount'
        })
        current: number,
        @SlashOption('end', {
            description: 'Level to end at'
        })
        end: number,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(interaction, Language, XptoCommand.message(current, end, Language))
    }

    static message(current: number, end: number, language: Languages): Promise<InteractionReplyOptions> {
        return new Promise((respond, error) => {
            const t = translation(language)

            if (current <= MAX_LEVEL && end <= MAX_LEVEL && current !== end) {
                // 'current' value is level
                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(t('Experience Calculator'))
                            .setThumbnail(botConfig.images.thumbnails.experience)
                            .addField(
                                t(`Experience Gap from {0} to {1}`, current, end),
                                formatNumber(
                                    Math.abs(experienceData[current - 1].total - experienceData[end - 1].total)
                                ) + t('xp')
                            )
                    ]
                })
            } else if (current > MAX_LEVEL && end <= MAX_LEVEL) {
                // 'current' value is experience points
                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(t('Experience Calculator'))
                            .setThumbnail(botConfig.images.thumbnails.experience)
                            .addField(
                                t(`Experience Gap from {0}xp to {1}`, current, end),
                                formatNumber(Math.abs(current - experienceData[end - 1].total)) + t('xp')
                            )
                    ]
                })
            } else if (current === end) {
                error(t('Both level values are the same'))
            } else {
                error(t('There was an error with the level values inputed'))
            }
        })
    }
}
