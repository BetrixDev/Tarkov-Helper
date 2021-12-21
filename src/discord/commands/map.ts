import 'reflect-metadata'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { CommandInteraction, MessageEmbed, InteractionReplyOptions, MessageActionRow, MessageButton, Interaction } from 'discord.js'
import { ResolveStrings, CapitalizeWords, ReadJson, FormatPrice } from '../../Lib'
import settings from '../../data/bot/settings'
import mapconfig from '../../data/command/mapconfig'
import { AppendCache } from '../../helpers/Cache'

const mapUrlPrefix = 'https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/map_icons/'

export type Map = 'thelab' | 'interchange' | 'woods' | 'customs' | 'factory' | 'reserve' | 'shoreline' | 'lighthouse'

@Discord()
export abstract class Command {
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
            description: 'What location to use',
            required: true
        })
        map: Map,
        interaction: CommandInteraction
    ) {}
}

export default async (interaction: CommandInteraction, args: { map: Map }): Promise<InteractionReplyOptions> => {
    const date = Date.now().toString()
    AppendCache(date, { interaction })
    const mapData = new MapInfo(args.map, interaction, date)

    return {
        embeds: [
            new MessageEmbed()
                .setColor(settings.botSettings.color)
                .setTitle(mapData.name)
                .setThumbnail(`${mapUrlPrefix}${args.map}.png`)
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

/*
    Data for command
*/

const mapImages: {
    [key: string]: { name: string; link: string; author: string }[]
} = mapconfig

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
    const raw = ReadJson('./game_data/database/locales/global/en.json').locations

    let formatted: { [key: string]: any } = {}

    Object.keys(raw).forEach((id) => {
        let data: { Name: string; Description: string } = raw[id]
        formatted[data.Name.replace(' ', '').toLowerCase()] = data.Description
    })

    return formatted
}

function GetRawData(map: Map) {
    const rawName = RawTranslator[map]
    return ReadJson(`./game_data/database/locations/${rawName}/base.json`)
}

class MapInfo {
    private map: Map
    private interaction: Interaction
    private date: string
    name: string
    data: any

    constructor(map: Map, interaction: Interaction, date: string) {
        this.map = map
        this.name = CapitalizeWords(map.replace('thelab', 'labs'))
        this.data = GetRawData(map)
        this.interaction = interaction
        this.date = date
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
            buttons.push(new MessageButton().setStyle('PRIMARY').setCustomId(`map__${this.date}__${this.map}__${image.name}`).setLabel(image.name))
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
