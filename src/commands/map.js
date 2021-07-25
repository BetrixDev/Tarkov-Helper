const { MessageEmbed } = require('discord.js')
const PossibleMaps = require('../game_data/maps.json')

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

// Command Functions
const CommandFunction = (args) => {
    let Map = args['map']

    let MapData = require(`../game_data/database/locations/${Map}/base.json`)
    let MapLootData = require(`../game_data/database/locations/${Map}/loot.json`)

    return {
        Type: "ServerMessage",
        Content: new MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle(`${CapitalizeName(Map)}`)
            .setDescription(MapData.Description)
            .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/map_icons/${Map.replace(' ', '%20')}.png`)
            .addFields({
                name: 'Map Genie',
                value: `[Click Here](https://mapgenie.io/tarkov/maps/${Map.replace('the ','')})`,
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
                name: 'Total PMC Extracts',
                value: MapData.exits.length
            }, {
                name: 'Total Loot Containers',
                value: MapLootData.static.length
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