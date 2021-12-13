import 'reflect-metadata'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { CommandInteraction, MessageEmbed, InteractionReplyOptions, MessageActionRow, MessageButton, Interaction } from 'discord.js'
import { ResolveStrings, CapitalizeWords, ReadJson, FormatPrice } from '../../Lib'
import settings from '../../botConfig'
import { AppendCache } from '../../helpers/Cache'

export const mapconfig = {
    thelab: [
        {
            name: 'In Game',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/0/0b/TheLabMapFull.png',
            author: 'Battlestate Games'
        },
        {
            name: 'All Floors',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/c/cf/The_Lab_Map_%28Horizontal%29_%28EN%29.png',
            author: 'FatalBulletHit'
        },
        {
            name: 'Basement',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/0/06/TheLabBasementByLogiwonk.png',
            author: 'Logiwonk'
        }
    ],
    interchange: [
        {
            name: 'General',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/e/e5/InterchangeMap_Updated_4.24.2020.png',
            author: 'Alpha_Stone & Lorathor'
        },
        {
            name: 'Stashes',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/f/fe/Interchange_hidden_stash_map.jpg',
            author: 'Unknown'
        }
    ],
    woods: [
        {
            name: 'In Game',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/8/84/Woods_Map_0.5.4.823.jpg',
            author: 'Battlestate Games'
        },
        {
            name: 'General',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/0/05/Glory4lyfeWoods_map_v4_marked.png',
            author: 'Jindouz'
        },
        {
            name: 'Stashes',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/5/55/Woods_Caches.png',
            author: 'Jindouz & do0b23_'
        }
    ],
    customs: [
        {
            name: 'General',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/2/27/2021_Customs_by_PaulRIISK.png',
            author: 'Paulriisk, Marvelin & Maksen'
        },
        {
            name: 'General 2',
            link: 'https://i.ibb.co/DYvj6Nn/Customs-Map-BWv4.png',
            author: 'Loweffortsaltbox & Re3mr'
        },
        {
            name: 'Dorms',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/9/96/DormRoomsMap.jpg',
            author: 'Offaperry & Marvelin'
        }
    ],
    factory: [
        {
            name: 'General',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/c/cd/Factory_3D_b_Johnny_Tushonka.jpg',
            author: 'ДЖОННИ ТУШОНКА (Johnny Tushonka)'
        }
    ],
    reserve: [
        {
            name: 'In Game',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/4/42/Reserve_Map_Translated.png',
            author: 'Battlestate Games'
        },
        {
            name: 'General',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/4/42/3D_Map_by_loweffortsaltbox.png',
            author: 'Loweffortsaltbox & Re3mr'
        },
        {
            name: 'Keys',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/9/9f/Keys_and_doors_v3.png',
            author: 'Photonready'
        },
        {
            name: 'Underground',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/d/d0/ReserveExpandedUnderground.png',
            author: 'Loweffortsaltbox & Re3mr'
        }
    ],
    shoreline: [
        {
            name: 'General',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/e/e1/Actual_caches_37_map_shoreline.jpg',
            author: 'Maksen, Freakpants & pelot_rules'
        },
        {
            name: 'Resort Loot',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/3/34/UNKSO_Shoreline_Resort_Loot_Map_VER_2.0.png',
            author: 'Marvelin & Jason'
        },
        {
            name: 'Key Spawns',
            link: 'https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/7/7e/ShorelineKeySpawnsByStealtheh.jpg',
            author: 'Maksen & Stealtheh'
        }
    ],
    lighthouse: [
        {
            name: 'General',
            link: 'https://raw.githubusercontent.com/kokarn/tarkov-tools/master/public/maps/lighthouse-landscape.jpg',
            author: 'JustinPai & WhiteWolf'
        }
    ]
}

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
    const raw = ReadJson('./data/game/database/locales/global/en.json').locations

    let formatted: { [key: string]: any } = {}

    Object.keys(raw).forEach((id) => {
        let data: { Name: string; Description: string } = raw[id]
        formatted[data.Name.replace(' ', '').toLowerCase()] = data.Description
    })

    return formatted
}

function GetRawData(map: Map) {
    const rawName = RawTranslator[map]
    return ReadJson(`./data/game/database/locations/${rawName}/base.json`)
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
