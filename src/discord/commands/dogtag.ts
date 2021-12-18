import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import settings from '../../data/bot/settings'
import { FormatPrice, ItemImage, ReadJson, ResolveStrings } from '../../Lib'

let MaxLevel: number = ReadJson('./src/data/game/database/globals.json').config.exp.level.exp_table.length

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('dogtag', {
        description: 'Gets the price of a dogtag at a certain level'
    })
    dogtag(
        @SlashOption('level', {
            description: 'Level of the dogtag',
            required: true
        })
        level: number,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, { level }: { level: number }): Promise<InteractionReplyOptions> => {
    return new Promise<InteractionReplyOptions>(async (respond, error) => {
        if (level > MaxLevel || level < 1) {
            error(`Please enter a valid level between 1 and ${MaxLevel}`)
        } else {
            respond({
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
            })
        }

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}
