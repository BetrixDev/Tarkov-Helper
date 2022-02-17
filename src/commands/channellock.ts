import 'reflect-metadata'
import { TextChannel, CommandInteraction, InteractionReplyOptions, Client } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { container, injectable } from 'tsyringe'
import { ServerDatabase } from '../database/server'
import { translation } from '../lib'

enum ErrorMessages {
    MUST_BE_OWNER = 'You must be the owner of this server to use this command',
    UNKNWON_ERROR = 'There was and error trying to change the channel lock, please try again later',
    UNKNOWN_ERROR_RESET = 'There was an error trying to reset the channel lock, please try again later'
}

@Discord()
@injectable()
export class ChannelLockCommand {
    constructor(private _servers: ServerDatabase) {}

    private isOwner(interaction: CommandInteraction) {
        return interaction.user.id === interaction.guild?.ownerId
    }

    @Slash('channellock', {
        description: 'Locks Tarkov Helper to only respond in a certain channel'
    })
    async channellock(
        @SlashOption('channel', {
            description: 'Which channel to lock the bot to. Input nothing to reset the lock',
            required: false
        })
        channel: TextChannel,
        interaction: CommandInteraction,
        client: Client,
        serverData: ServerData
    ): Promise<InteractionReplyOptions> {
        return new Promise(async (respond, error) => {
            const t = translation(serverData.Language)

            if (!this.isOwner(interaction)) {
                error(t(ErrorMessages.MUST_BE_OWNER))
            }

            const db = container.resolve(ChannelLockCommand)

            if (channel) {
                const success = await db._servers.set(interaction.guildId, 'ChannelLock', channel)

                if (success) {
                    respond({
                        content: t('Changed channel lock to: **{0}**:', channel.name),
                        ephemeral: true
                    })
                } else {
                    error(t(ErrorMessages.UNKNWON_ERROR))
                }
            } else {
                const success = await db._servers.set(interaction.guildId, 'ChannelLock', '')

                if (success) {
                    respond({ content: t('Reset channel lock'), ephemeral: true })
                } else {
                    error(t(ErrorMessages.UNKNOWN_ERROR_RESET))
                }
            }
        })
    }
}
