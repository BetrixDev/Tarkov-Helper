import 'reflect-metadata'
import { ButtonComponent, Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { injectable } from 'tsyringe'
import { fetchData } from '../data/cache'
import { ButtonInteraction, Client, CommandInteraction, InteractionReplyOptions, MessageActionRow } from 'discord.js'
import { Location } from '../data/classes/location'
import { handleCommandInteraction, THEmbed, translation } from '../lib'

const mapImages = fetchData<MapImageData>('maps')
const mapUrlPrefix = 'https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/map_icons'

@Discord()
@injectable()
export class MapCommand {
    @Slash('map', {
        description: 'Returns information and maps of a certain location'
    })
    async map(
        @SlashChoice('Lighthouse', 'lighthouse')
        @SlashChoice('Labs', 'thelab')
        @SlashChoice('Interchange', 'interchange')
        @SlashChoice('Woods', 'woods')
        @SlashChoice('Customs', 'customs')
        @SlashChoice('Factory', 'factory')
        @SlashChoice('Reserve', 'reserve')
        @SlashChoice('Shoreline', 'shoreline')
        @SlashOption('map', {
            description: 'What location to use'
        })
        mapName: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                const t = translation(Language)
                const map = new Location(mapName as Maps, Language)

                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(map.name)
                            .setThumbnail(`${mapUrlPrefix}/${map.name.toLowerCase()}.png`)
                            .setDescription(map.description)
                            .setFooter({ text: t('Click the buttons below to view maps') })
                            .setFields(
                                {
                                    name: t('Raid Time'),
                                    value: t('{0} minutes', map.raidTime),
                                    inline: true
                                },
                                {
                                    name: t('Player Count'),
                                    value: `${map.playerCount.min} - ${map.playerCount.max}`,
                                    inline: true
                                },
                                {
                                    name: t('Has Insurance?'),
                                    value: map.hasInsurance ? t('yes') : t('no'),
                                    inline: true
                                },
                                {
                                    name: t('Exits'),
                                    value: '\u200b',
                                    inline: true
                                },
                                {
                                    name: '\u200b',
                                    value: '\u200b',
                                    inline: true
                                },
                                {
                                    name: '\u200b',
                                    value: '\u200b',
                                    inline: true
                                },
                                ...map.exfilInfo
                            )
                    ],
                    components: [new MessageActionRow().addComponents(map.mapButtons)]
                })
            })
        )
    }

    @ButtonComponent(/^map__/)
    mapButton(interaction: ButtonInteraction) {
        const [, l, m, type] = interaction.customId.split('__')
        const map = m as Maps
        const language = l as Languages

        const t = translation(language)

        const imageData = mapImages[map.toLowerCase()].find((t) => t.name == type) as MapImage

        interaction.reply({
            embeds: [
                new THEmbed()
                    .setImage(imageData.link)
                    .setTitle(t('{0} {1} Map', map, type))
                    .setFooter({ text: t('Map created by: {0}', imageData.author) })
            ],
            ephemeral: true
        })
    }
}
