import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { ErrorReponse, FormatPrice, ItemImage, ReadJson, ResolveStrings } from '../lib'
import settings from '../data/settings'

let MaxLevel: number = ReadJson<any>('game_data/database/globals.json').config.exp.level.exp_table.length

@Discord()
export class DogtagCommand {
    @Slash('dogtag', {
        description: 'Gets the price of a dog tag at a certain level'
    })
    dogtag(
        @SlashOption('level', {
            description: `Level of the dogtag (1-${MaxLevel})`,
            required: true
        })
        level: number,
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.message(level, interaction))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(level: number, interaction: CommandInteraction) {
        if (level > MaxLevel || level < 1) {
            return ErrorReponse(`Please enter a valid level between 1 and ${MaxLevel}`, interaction)
        } else {
            return {
                embeds: [
                    new MessageEmbed()
                        .setColor(settings.botSettings.color)
                        .setTitle('Dogtag Price')
                        .setThumbnail(ItemImage('59f32c3b86f77472a31742f0'))
                        .addFields(
                            ResolveStrings([
                                {
                                    name: 'Level of Dogtag',
                                    value: level
                                },
                                {
                                    name: 'Price of Dogtag',
                                    value: FormatPrice(level * 378)
                                }
                            ])
                        )
                ]
            }
        }
    }
}
