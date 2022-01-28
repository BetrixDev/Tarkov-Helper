// Contains all admin related commands

import { ApplicationCommandPermissions, CommandInteraction, Role, TextChannel } from 'discord.js'
import { Discord, Permission, Slash, SlashOption } from 'discordx'
import { container, injectable } from 'tsyringe'
import { ServerDatabase } from '../database/server'
import { ErrorReponse } from '../lib'

@Discord()
@injectable()
// @Permission(false)
// @Permission(async (guild): Promise<ApplicationCommandPermissions> => {
//     // Only the owner of the server can use these commands
//     return { id: guild.ownerId, type: 'USER', permission: true }
// })
export class AdminCommands {
    constructor(private serverDatabase: ServerDatabase) {}

    @Slash('channellock', {
        description: 'Locks Tarkov Helper to only respond in a certain channel'
    })
    async channellock(
        @SlashOption('channel', {
            description: 'Which channel to lock the bot to. Input nothing to reset the lock',
            required: false
        })
        channel: TextChannel,
        interaction: CommandInteraction
    ) {
        try {
            // Redundant check
            if (interaction.user.id !== interaction.guild?.ownerId)
                interaction.reply(ErrorReponse('You must be the owner of this server to use this command', interaction))

            const commandClass = container.resolve(AdminCommands)

            if (channel) {
                const success = await commandClass.serverDatabase.set(interaction.guildId, 'ChannelLock', channel)

                if (success) {
                    const channelData = interaction.guild?.channels.resolve(channel)

                    interaction.reply({
                        content: `Changed channel lock to: **${channelData?.name ?? 'UNKNOWN'}**`,
                        ephemeral: true
                    })
                } else {
                    interaction.reply(
                        ErrorReponse(
                            'There was and error trying to change the channel lock, please try again later',
                            interaction
                        )
                    )
                }
            } else {
                const success = await commandClass.serverDatabase.set(interaction.guildId, 'ChannelLock', '')

                if (success) {
                    interaction.reply({
                        content: `Reset channel lock`,
                        ephemeral: true
                    })
                } else {
                    interaction.reply(
                        ErrorReponse(
                            'There was and error trying to reset the channel lock, please try again later',
                            interaction
                        )
                    )
                }
            }
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    @Slash('cooldown', {
        description: 'Sets the cooldown time. default: 3 seconds'
    })
    async cooldown(
        @SlashOption('time', {
            description: 'Cooldown length'
        })
        time: number,
        interaction: CommandInteraction
    ) {
        try {
            // Redundant check
            if (interaction.user.id !== interaction.guild?.ownerId)
                interaction.reply(ErrorReponse('You must be the owner of this server to use this command', interaction))

            const database = container.resolve(AdminCommands).serverDatabase

            if (time < 0 && time < 61)
                interaction.reply(ErrorReponse('Please make sure Cooldown is between 0 and 60 seconds', interaction))

            database.set(interaction.guildId, 'Cooldown', time)

            interaction.reply({ content: `Changed Cooldown time to: **${time}s**`, ephemeral: true })
        } catch {
            interaction.reply(ErrorReponse('Error changing cooldown time, please try again later', interaction))
        }
    }
}
