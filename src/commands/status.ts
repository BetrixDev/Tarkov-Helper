import { Client, CommandInteraction } from 'discord.js'
import { Discord, Slash } from 'discordx'
import request, { gql } from 'graphql-request'
import botConfig from '../config/BotConfig'
import { handleCommandInteraction, THEmbed, translation } from '../Lib'
import { ServerStatus } from '../types/game/Status'

const query = gql`
    {
        status {
            currentStatuses {
                name
                statusCode
            }
            generalStatus {
                name
                message
                status
                statusCode
            }
            messages {
                time
                type
                content
                statusCode
            }
        }
    }
`

@Discord()
export abstract class StatusCommand {
    @Slash('status', {
        description: 'Returns information regarding server status and stability'
    })
    async status(interaction: CommandInteraction, client: Client, { serverData: { Language } }: GuardData) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise(async (respond, error) => {
                const t = translation(Language)

                const reponse = await request<{ status: ServerStatus }>('https://api.tarkov.dev/graphql', query)
                const status = reponse.status

                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(`${status.generalStatus.name} Status: ${status.generalStatus.statusCode}`)
                            .setDescription(status.messages.length > 0 ? `*"${status.messages[0].content}"*` : '\u200b')
                            .setThumbnail(botConfig.images.thumbnails.status)
                            .addFields(
                                status.currentStatuses.map((s) => {
                                    return {
                                        name: s.name,
                                        value: s.statusCode.replace('OK', 'Stable'),
                                        inline: true
                                    }
                                })
                            )
                    ]
                })

                setTimeout(() => {
                    error(t('Failed to recieve a response'))
                }, 2500)
            })
        )
    }
}
