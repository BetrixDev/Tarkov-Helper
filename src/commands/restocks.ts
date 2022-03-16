import 'reflect-metadata'
import { Client, Discord, Slash } from 'discordx'
import request, { gql } from 'graphql-request'
import { CommandInteraction } from 'discord.js'
import { capitalizeWords, handleCommandInteraction, THEmbed, translation } from '../lib'
import botConfig from '../config/bot-config'
import dayjs from 'dayjs'
import { Trader } from '../data/classes/trader'
import { TraderReset } from '../types/game/restock'

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
    async restocks(interaction: CommandInteraction, client: Client, { serverData: { Language } }: GuardData) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise(async (respond, error) => {
                const t = translation(Language)

                const { traderResetTimes } = await request<{ traderResetTimes: TraderReset[] }>(
                    'https://tarkov-tools.com/graphql',
                    query
                )

                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(t('Trader restock times'))
                            .setThumbnail(botConfig.images.thumbnails.trader)
                            .addFields(
                                ...traderResetTimes.map((reset) => {
                                    return {
                                        name: new Trader(capitalizeWords(reset.name), Language).name,
                                        value: `<t:${dayjs(reset.resetTimestamp).unix()}:R>`,
                                        inline: true
                                    }
                                }),
                                {
                                    name: '\u200b',
                                    value: '\u200b',
                                    inline: true
                                }
                            )
                            .setFooter({ text: t('Data from tarkov-tools.com') })
                    ]
                })
            })
        )
    }
}
