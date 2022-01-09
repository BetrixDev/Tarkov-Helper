import 'reflect-metadata'
import { Discord, Slash } from 'discordx'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { gql, request } from 'graphql-request'
import { ErrorReponse, THEmbed } from '../lib'
import settings from '../data/settings'

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
export class StatusCommand {
    @Slash('status', {
        description: 'Returns information regarding server status and stability'
    })
    async status(interaction: CommandInteraction) {
        try {
            interaction.reply(await this.message(interaction))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    async message(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
        return new Promise(async (resolve) => {
            const reponse = await request<{ status: ServerStatus }>('https://tarkov-tools.com/graphql', query)
            const status = reponse.status

            resolve({
                embeds: [
                    new THEmbed()
                        .setTitle(`${status.generalStatus.name} Status: ${status.generalStatus.statusCode}`)
                        .setDescription(`*"${status.messages[0].content}"*`)
                        .setThumbnail(settings.images.thumbnails.status)
                        .addFields(
                            status.currentStatuses.map((s) => {
                                return { name: s.name, value: s.statusCode.replace('OK', 'Stable'), inline: true }
                            })
                        )
                ]
            })

            // We have 3 seconds before the interaction fails
            setTimeout(() => {
                resolve(ErrorReponse('Failed to recieve a response', interaction))
            }, 2750)
        })
    }
}
