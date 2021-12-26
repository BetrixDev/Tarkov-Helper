import { Interaction } from 'discord.js'
import { ArgsOf, Client, Discord, On } from 'discordx'
import { container, injectable } from 'tsyringe'
import { CooldownDatabase } from '../database/cooldowns'
import { ServerDatabase } from '../database/server'
import { Round } from '../lib'

const isOwner = (interaction: Interaction) => interaction.user.id === interaction.guild?.ownerId

@Discord()
@injectable()
export class InteractionCreate {
    constructor(private _cooldowns: CooldownDatabase, private _servers: ServerDatabase) {}

    @On('interactionCreate')
    async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client) {
        if (interaction.isCommand()) {
            const db = container.resolve(InteractionCreate)

            const serverData = await db._servers.query(interaction.guildId)

            if (serverData.ChannelLock !== '' && !isOwner(interaction)) {
                if (serverData.ChannelLock !== interaction.channelId) {
                    const channelName = await interaction.guild?.channels
                        .fetch(serverData.ChannelLock)
                        .then((channel) => {
                            return channel?.name
                        })

                    interaction.reply({
                        content: `This channel is locked, please use: **${channelName ?? 'UNKNOWN'}**`,
                        ephemeral: true
                    })
                    return
                }
            }

            const date = Date.now()
            const userLastMessage = db._cooldowns.query(interaction.user.id)

            if (!userLastMessage || (date - userLastMessage) * 0.001 > serverData.Cooldown || isOwner(interaction)) {
                client.executeInteraction(interaction)
                db._cooldowns.update(interaction.user.id, date)
            } else {
                interaction.reply({
                    content: `Cooldown: Please wait ${
                        serverData.Cooldown - Round((date - userLastMessage) * 0.001, '00')
                    }s`,
                    ephemeral: true
                })
                return
            }
        } else {
            client.executeInteraction(interaction)
        }
    }
}
