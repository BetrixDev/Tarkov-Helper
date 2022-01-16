import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Discord, Slash } from 'discordx'
import { gql, request } from 'graphql-request'
import moment from 'moment-timezone'
import settings from '../data/settings'
import { CapitalizeWords, ErrorReponse, THEmbed } from '../lib'

const query = gql`
    {
        traderResetTimes {
            name
            resetTimestamp
        }
    }
`

@Discord()
export class RestockCommand {
    @Slash('restocks', {
        description: 'Returns the time left till each trader restocks'
    })
    async restocks(interaction: CommandInteraction) {
        try {
            interaction.reply(await this.message(interaction))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    async message(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
        return new Promise(async (resolve) => {
            const { traderResetTimes } = await request<{ traderResetTimes: TraderReset[] }>(
                'https://tarkov-tools.com/graphql',
                query
            )

            resolve({
                embeds: [
                    new THEmbed()
                        .setTitle('Trader restock times')
                        .setThumbnail(settings.images.thumbnails.trader)
                        .addFields(
                            ...traderResetTimes.map((reset) => {
                                return {
                                    name: CapitalizeWords(reset.name),
                                    value: `<t:${moment(reset.resetTimestamp).unix()}:R>`,
                                    inline: true
                                }
                            }),
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true
                            }
                        )
                        .setFooter('Data from tarkov-tools.com')
                ]
            })

            // We have 3 seconds before the interaction fails
            setTimeout(() => {
                resolve(ErrorReponse('Failed to recieve a response', interaction))
            }, 2750)
        })
    }
}
