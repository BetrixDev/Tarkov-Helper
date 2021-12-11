import 'reflect-metadata'
import { ArgsOf, Discord, On } from 'discordx'
import { ReadCache } from '../../helpers/Cache'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { AdminCheck, ErrorReponse, Round } from '../../Lib'
import { ServerData } from '../../helpers/Database'

const LastMessages = new Map<string, number>()

@Discord()
abstract class Event {
    @On('interactionCreate')
    private async interaction([interaction]: ArgsOf<'interactionCreate'>) {
        const serverData = await ServerData(interaction.guildId)
        const isUserAdmin = AdminCheck(interaction, serverData.AdminRole)

        const date = Date.now()

        try {
            if (interaction.isButton()) {
                // Button Interaction
                // Grab the name and cache key from within the customid
                const id = interaction.customId.split('__')
                const [name, key] = id

                // Get data either from the cache or passed in from the customId
                let data = [ReadCache(key), ...id.slice(2)]

                // Check to make sure buttons are meant for the user who interacted with them
                const orignalUserId = interaction.user.id
                if (orignalUserId && orignalUserId !== interaction.user.id) {
                    interaction.reply({ ephemeral: true, content: 'This button is not meant for you' })
                    return
                }

                // Call message and let the function decide how to reply to interaction
                const message = require(`../buttons/${name}`).Message
                await message(interaction, data, serverData)
            } else if (interaction.isCommand()) {
                // Handle cooldown first
                let userLastMessage = LastMessages.get(interaction.user.id)

                if (!userLastMessage) {
                    LastMessages.set(interaction.user.id, date)
                    userLastMessage = 0
                }

                const lastMessageTimeAgo = (date - userLastMessage) * 0.001
                if (lastMessageTimeAgo < serverData.Cooldown && !isUserAdmin) {
                    interaction.reply({ content: `Cooldown: Please wait ${serverData.Cooldown - Round(lastMessageTimeAgo, '00')}`, ephemeral: true })
                    return
                }

                // Handle channel lock next
                if (serverData.ChannelLock !== '' && !isUserAdmin) {
                    if (serverData.ChannelLock !== interaction.channelId) {
                        const channelName = await interaction.guild?.channels.fetch(serverData.ChannelLock).then((channel) => {
                            return channel?.name
                        })
                        interaction.reply({ content: `This channel is locked, please use: **${channelName ?? 'UNKNOWN'}**`, ephemeral: true })
                        return
                    }
                }

                // Command Interaction
                // Format arguments into easier to use object
                const args: { [key: string]: any } = {}
                interaction.options.data.forEach((arg) => {
                    args[arg.name] = arg.value
                })

                // Call message and reply with the returned content
                const message: (
                    interaction: CommandInteraction,
                    args: { [key: string]: {} },
                    serverData?: ServerData
                ) => Promise<InteractionReplyOptions> = require(`../commands/${interaction.commandName}`).default

                /* await */ message(interaction, args, serverData)
                    .then((content) => {
                        interaction.reply(content)
                    })
                    .catch((content) => {
                        interaction.reply({ ...ErrorReponse(content, interaction.commandName), ephemeral: true })
                    })
            } else if (interaction.isSelectMenu()) {
                // Select Menu Interaction

                // Grab the name and cache key from within the customid
                const id = interaction.customId.split('__')
                const [name, key] = id

                // Get data either from the cache or passed in from the customId
                let data = [ReadCache(key), ...id.slice(2)]

                // Check to make sure buttons are meant for the user who interacted with them
                const orignalUserId = interaction.user.id
                if (orignalUserId && orignalUserId !== interaction.user.id) {
                    interaction.reply({ ephemeral: true, content: 'This button is not meant for you' })
                    return
                }

                // Call message and let the function decide how to reply to interaction
                const message = require(`../menus/${name}`).Message
                await message(interaction, data)
            } else if (interaction.isContextMenu()) {
                // Context Menu Interaction
            }
        } catch (e) {
            console.log(e)
            console.log('Error executing interaction')
        }
    }
}
