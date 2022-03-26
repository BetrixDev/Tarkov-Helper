import 'reflect-metadata'
import { Client, Discord, Slash } from 'discordx'
import request, { gql } from 'graphql-request'
import { CommandInteraction } from 'discord.js'
import { capitalizeWords, handleCommandInteraction, THEmbed, translation } from '../Lib'
import botConfig from '../config/BotConfig'
import dayjs from 'dayjs'
import { Trader } from '../data/classes/Trader'
import { TraderReset } from '../types/game/Restock'

const query = gql`
    {
        traderResetTimes {
            name
            resetTimestamp
        }
    }
`

@Discord()
export abstract class RestockCommand {
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
                    'https://api.tarkov.dev/graphql',
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
