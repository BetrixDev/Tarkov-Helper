import 'reflect-metadata'

import { CommandInteraction, InteractionReplyOptions, Role, TextChannel } from 'discord.js'
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx'
import { ServerData, SetServerData } from '../../helpers/Database'
import { AdminCheck } from '../../Lib'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('channellock', {
        description: 'ADMIN COMMAND: Locks Tarkov Helper to only respond in a certain channel'
    })
    channellock(
        @SlashOption('channel', {
            description: 'Which channel to lock the bot to. Input nothing to reset the lock',
            required: false
        })
        channel: TextChannel
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: { channel: string }, serverData: ServerData) => {
    return new Promise<InteractionReplyOptions>(async (resolve, error) => {
        const { channel } = args

        if (await AdminCheck(interaction, serverData.AdminRole)) {
            if (channel) {
                // Set a channel to lock the bot to
                const success = await SetServerData(interaction.guildId, 'ChannelLock', channel)

                if (success) {
                    resolve({
                        content: `Changed channel lock to: **${await interaction.guild?.channels.fetch(channel).then((channel) => channel?.name)}**`,
                        ephemeral: true
                    })
                } else {
                    error('There was and error trying to change the channel lock, please try again later')
                }
            } else {
                // Reset the channel lock to nothing
                const success = await SetServerData(interaction.guildId, 'ChannelLock', '')

                if (success) {
                    resolve({
                        content: `Reset channel lock`,
                        ephemeral: true
                    })
                } else {
                    error('There was and error trying to reset the channel lock, please try again later')
                }
            }
        } else {
            error('Insufficient premission, you must be an admin of this server')
        }

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}
