require('../utils')
const { MessageEmbed } = require('discord.js')
const PossibleMaps = require('../game_data/maps.json')
let LocationStrings = ReadJson('./src/game_data/database/locales/global/en.json').locations
console.log(LocationStrings)

function GetMaps() {
    let Result = new Array()

    for (const DisplayName in PossibleMaps) {
        Result.push({
            name: DisplayName,
            value: PossibleMaps[DisplayName]
        })
    }

    return Result
}

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'map',
            description: 'Returns information and maps of a certain location',
            options: [{
                name: 'map',
                description: 'map to get info of',
                required: true,
                type: 3,
                choices: GetMaps()
            }]
        }
    }
}

let mapIDs = {
    "laboratory": "5b0fc42d86f7744a585f9105",
    "bigmap": "56f40101d2720b2a4d8b45d6",
    "woods": "5704e3c2d2720bac5b8b4567",
    "rezervbase": "5704e5fad2720bc05b8b4567",
    "shoreline": "5704e554d2720bac5b8b456e",
    "interchange": "5714dbc024597771384a510d",
    "factory4_day": "55f2d3fd4bdc2d5f408b4567"
}

// Command Functions
const CommandFunction = (args) => {
    let Map = args['map']

    let MapData = ReadJson(`./src/game_data/database/locations/${Map}/base.json`)
    let MapLootData = ReadJson(`./src/game_data/database/locations/${Map}/loot.json`)

    let mapID = mapIDs[Map]

    let mapName = LocationStrings[mapID].Name

    return {
        Type: "ServerMessage",
        Content: new MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle(mapName)
            .setDescription(LocationStrings[mapID].Description)
            .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/map_icons/${Map.replace(' ', '%20')}.png`)
            .addFields({
                name: 'Map Genie',
                value: `[Click Here](https://mapgenie.io/tarkov/maps/${mapName.replace('The ', '')})`,
                inline: true
            }, {
                name: 'Player Count',
                value: `${MapData.MinPlayers} - ${MapData.MaxPlayers}`,
                inline: true
            }, {
                name: 'Raid Time',
                value: `${MapData.escape_time_limit} minutes`,
                inline: true
            }, {
                name: 'Has Insurance',
                value: CapitalizeName(MapData.Insurance.toString()),
                inline: true
            }, {
                name: 'Total Loot Containers',
                value: MapLootData.static.length
            }, {
                name: 'Extracts',
                value: MapData.exits.map(exfil => {
                    let properties = new Array()
                    properties.push(`**${exfil.Chance}%** Chance`)
                    properties.push(`**${exfil.ExfiltrationTime}s** Time`)

                    if (exfil.Count !== 0 && exfil.Count !== undefined) {
                        properties.push(`**${FormatPrice(exfil.Count)}** Price`)
                    }
                    return `__${exfil.Name.replaceAll('_', ' ').replace('lab', '')}__: ${properties.join(', ')}`
                })
            })
    }
}

const CapitalizeName = (string) => {
    let words = string.split(' ')

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    return words.join(' ')
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings