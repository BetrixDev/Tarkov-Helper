import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { fetchData } from '../data/Cache'
import { formatPrice, getItemImage, handleCommandInteraction, THEmbed, translation } from '../Lib'
import { readFileSync } from 'jsonfile'

export const MAX_LEVEL: number = readFileSync('./data/globals.json').config.exp.level.exp_table.length
const DOGTAG_PRICE_PER_LEVEL = 378

@Discord()
export abstract class DogtagCommand {
    @Slash('dogtag', {
        description: 'Gets the price of a dog tag at a certain level'
    })
    dogtag(
        @SlashOption('level', {
            description: `Level of the dogtag (1-${MAX_LEVEL})`
        })
        level: number,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(interaction, Language, DogtagCommand.message(level, Language))
    }

    static message(level: number, language: Languages): Promise<InteractionReplyOptions> {
        return new Promise((respond, error) => {
            const t = translation(language)

            if (level > MAX_LEVEL || level < 1) {
                error(t('Please enter a valid level between 1 and {0}', MAX_LEVEL))
            } else {
                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(t('Dogtag Price'))
                            .setThumbnail(getItemImage('59f32c3b86f77472a31742f0'))
                            .setFields(
                                {
                                    name: t('Level of Dogtag'),
                                    value: level.toString()
                                },
                                {
                                    name: t('Price of Dogtag'),
                                    value: formatPrice(level * DOGTAG_PRICE_PER_LEVEL)
                                }
                            )
                    ]
                })
            }
        })
    }
}
