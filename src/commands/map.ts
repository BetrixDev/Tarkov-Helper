import 'reflect-metadata'
import { ButtonComponent, Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from 'discord.js'
import { CapitalizeWords, ErrorReponse, FormatPrice, ReadJson, ResolveStrings, THEmbed } from '../lib'

const mapImages = ReadJson<MapLinks>('./game_data/maps.json')

const mapUrlPrefix = 'https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/map_icons/'

@Discord()
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
        map: MapNames,
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.message(map))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(map: MapNames) {
        const mapData = new MapInfo(map)

        return {
            embeds: [
                new THEmbed()
                    .setTitle(mapData.name)
                    .setThumbnail(`${mapUrlPrefix}${map}.png`)
                    .setDescription(`*"${mapData.Description}"*`)
                    .setFooter('Click the buttons below to view maps')
                    .addFields(
                        ResolveStrings([
                            {
                                name: 'Raid Time',
                                value: `${mapData.data.escape_time_limit} minutes`,
                                inline: true
                            },
                            {
                                name: 'Player Count',
                                value: `${mapData.PlayerCount.min} - ${mapData.PlayerCount.max}`,
                                inline: true
                            },
                            {
                                name: 'Has Insurance?',
                                value: mapData.Insurance,
                                inline: true
                            },
                            {
                                name: 'Exits',
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
                            ...mapData.Exits
                        ])
                    )
            ],
            components: [new MessageActionRow().addComponents(mapData.Images)]
        }
    }

    @ButtonComponent(/^map__/)
    mapButton(interaction: ButtonInteraction) {
        const [_, m, type] = interaction.customId.split('__')
        const map = m as MapNames

        const formattedMapName = CapitalizeWords(map.replace('thelab', 'labs'))
        const imageData = mapImages[map].find((t) => t.name == type)

        interaction.reply({
            embeds: [
                new THEmbed()
                    .setImage(imageData?.link ?? '')
                    .setTitle(`${formattedMapName} ${type} Map`)
                    .setFooter(`Map created by: ${imageData?.author ?? 'unknown'}`)
            ],
            ephemeral: true
        })
    }
}

enum RawTranslator {
    customs = 'bigmap',
    factory = 'factory4_day',
    interchange = 'interchange',
    thelab = 'laboratory',
    reserve = 'rezervbase',
    shoreline = 'shoreline',
    woods = 'woods',
    lighthouse = 'lighthouse'
}

function GetDescriptions(): { [key: string]: any } {
    const raw = ReadJson<any>('./game_data/database/locales/global/en.json').locations

    let formatted: { [key: string]: any } = {}

    Object.keys(raw).forEach((id) => {
        let data: { Name: string; Description: string } = raw[id]
        formatted[data.Name.replace(' ', '').toLowerCase()] = data.Description
    })

    return formatted
}

function GetRawData(map: MapNames) {
    const rawName = RawTranslator[map]
    return ReadJson<any>(`./game_data/database/locations/${rawName}/base.json`)
}

export class MapInfo {
    private map: MapNames
    name: string
    data: any

    constructor(map: MapNames) {
        this.map = map
        this.name = CapitalizeWords(map.replace('thelab', 'labs'))
        this.data = GetRawData(map)
    }
    get PlayerCount() {
        return { min: this.data.MinPlayers, max: this.data.MaxPlayers }
    }
    get Description() {
        return GetDescriptions()[this.map].substr(0, 150).concat('...')
    }
    get Insurance() {
        return this.data.Insurance ? 'Yes' : 'No'
    }
    get Images() {
        let buttons = new Array()

        buttons.push(
            new MessageButton()
                .setStyle('LINK')
                .setURL(`https://mapgenie.io/tarkov/maps/${this.map.replace('the', '')}`)
                .setLabel('Map Genie')
        )

        mapImages[this.map].forEach((image: { name: string }) => {
            buttons.push(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setCustomId(`map__${this.map}__${image.name}`)
                    .setLabel(image.name)
            )
        })

        return buttons
    }
    get Exits() {
        let exits = new Array()
        const data = this.data.exits

        data.forEach((exit: { Chance: any; ExfiltrationTime: any; Count: number; Name: string }) => {
            let extras = [`*Chance:* \`${exit.Chance}%\``, `*Time:* \`${exit.ExfiltrationTime}s\``]
            if (exit.Count > 0) {
                extras.push(`*Price:* \`${FormatPrice(exit.Count)}\``)
            }

            exits.push({
                name: exit.Name.replaceAll('_', '').replace('lab', '').replace('EXFIL', ''),
                value: extras.join('\n'),
                inline: true
            })
        })

        while (exits.length % 3 !== 0) {
            exits.push({ name: '\u200b', value: '\u200b', inline: true })
        }

        return exits
    }
}
