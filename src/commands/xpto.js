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


const DiscordJS = require('discord.js')
const Settings = require('../settings.json')
const ExperienceData = require('../game_data/experience.json')
const { ErrorMessage } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args) => {
    let Current = args['current']
    let End = args['end']

    if (Current < 71 && End < 71 && Current !== End) {
        return {
            Type: "ServerMessage",
            Content: new DiscordJS.MessageEmbed()
                .setTitle('Experience Calculator')
                .setThumbnail(Settings.Images.Thumbnails.Experience)
                .addFields({
                    name: `Experience Gap From ${Current} To ${End}`,
                    value: (Math.abs(ExperienceData[Current].Total - ExperienceData[End].Total)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                })
        }
    } else if (Current > 999 && End > 71 && Current !== End) {
        return {
            Type: "ServerMessage",
            Content: new DiscordJS.MessageEmbed()
                .setTitle('Experience Calculator')
                .setThumbnail(Settings.Images.Thumbnails.Experience)
                .addFields({
                    name: `Experience Gap From ${Current}xp To ${End}`,
                    value: (Math.abs(ExperienceData[Current].Total - End)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                })
        }
    } else if (Current === End) {
        return { Type: "Error", Content: ErrorMessage('Both inputs are equal, nothing to compare'), Time: 7000 }
    } else if (Current < 1000 && Current > 70) {
        return { Type: "Error", Content: ErrorMessage('Input is to high to be a level and too low to be an experience value'), Time: 7000 }
    } else if (End < 1000 && End > 70) {
        return { Type: "Error", Content: ErrorMessage('Input is to high to be a level and too low to be an experience value'), Time: 7000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings