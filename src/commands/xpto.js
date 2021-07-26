// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'xpto',
            description: 'Calculate the experience needed to reach a certain level',
            options: [{
                    name: 'current',
                    description: 'Current Level. Can also be Experience Amount',
                    required: true,
                    type: 4
                },
                {
                    name: 'end',
                    description: 'Level to end at',
                    required: true,
                    type: 4
                }
            ]
        }
    }
}

require('../utils')
const DiscordJS = require('discord.js')

function ExperienceData() {
    let Result = new Object()

    let ExpData = require('../game_data/database/globals.json').config.exp.level.exp_table

    let TotalExp = 0

    for (i in ExpData) {
        let LevelData = ExpData[i]

        TotalExp = TotalExp + LevelData.exp

        Result[Number(i) + 1] = {
            FromPrevious: LevelData.exp,
            Total: TotalExp
        }
    }

    return Result
}

let MaxLevel = require('../game_data/database/globals.json').config.exp.level.exp_table.length

// Command Functions
const CommandFunction = (args) => {
    let Current = Number(args['current'])
    let End = Number(args['end'])

    if (Current <= MaxLevel && End <= MaxLevel && Current !== End) {
        return {
            Type: "ServerMessage",
            Content: new DiscordJS.MessageEmbed()
                .setColor(Settings.BotSettings.Color)
                .setTitle('Experience Calculator')
                .setThumbnail(Settings.Images.Thumbnails.Experience)
                .addFields({
                    name: `Experience Gap From ${Current} To ${End}`,
                    value: (Math.abs((ExperienceData())[Current].Total - ExperienceData()[End].Total)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                })
        }
    } else if (Current > 999 && End <= MaxLevel && Current !== End) {
        return {
            Type: "ServerMessage",
            Content: new DiscordJS.MessageEmbed()
                .setColor(Settings.BotSettings.Color)
                .setTitle('Experience Calculator')
                .setThumbnail(Settings.Images.Thumbnails.Experience)
                .addFields({
                    name: `Experience Gap From ${Current}xp To ${End}`,
                    value: (Math.abs(Current - ExperienceData()[End].Total)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                })
        }
    } else if (Current === End) {
        return { Type: "Error", Content: ErrorMessage('Both inputs are equal, nothing to compare'), Time: 7000 }
    } else if (Current < 1000 && Current > MaxLevel) {
        return { Type: "Error", Content: ErrorMessage('Input is to high to be a level and too low to be an experience value'), Time: 7000 }
    } else if (End < 1000 && End > MaxLevel) {
        return { Type: "Error", Content: ErrorMessage('Input is to high to be a level and too low to be an experience value'), Time: 7000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings