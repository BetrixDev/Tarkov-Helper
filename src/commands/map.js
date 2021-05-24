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
                type: 3
            }]
        }
    },
    DMCommand: true
}

const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const PossibleMaps = require('../game_data/maps.json')
const { MapSearchEngine } = require('../command_modules/mapsearchengine')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args) => {
    let Map = MapSearchEngine(args['map'].toLowerCase())

    if (PossibleMaps.includes(Map)) {
        let MapData = JSON.parse(fs.readFileSync(`./src/game_data/maps/${Map}.json`))
        return {
            Type: "ServerMessage",
            Content: new MessageEmbed()
                .setTitle(`${CapitalizeName(Map)}`)
                .setDescription(MapData.base.Description)
                .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/map_icons/${Map.replace(' ', '%20')}.png`)
                .addFields({
                    name: 'Map Genie',
                    value: `[Click Here](https://mapgenie.io/tarkov/maps/${Map.replace('the ','')})`,
                    inline: true
                }, {
                    name: 'Player Count',
                    value: `${MapData.base.MinPlayers} - ${MapData.base.MaxPlayers}`,
                    inline: true
                }, {
                    name: 'Raid Time',
                    value: `${MapData.base.escape_time_limit} minutes`,
                    inline: true
                }, {
                    name: 'Has Insurance',
                    value: CapitalizeName(MapData.base.Insurance.toString()),
                    inline: true
                }, {
                    name: 'Total PMC Extracts',
                    value: MapData.base.exits.length
                }, {
                    name: 'Total Static Loot Spawns',
                    value: MapData.loot.static.length
                })
        }
    } else {
        return { Type: "Error", Content: ErrorMessageField('Please input a valid map', { name: 'Maps', value: PossibleMaps }), Time: 10000 }
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