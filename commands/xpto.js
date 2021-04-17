// Command Config
const CommandSettings = {
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

const DiscordJS = require('discord.js')
const Settings = require('../settings.json')
const ExperienceData = require('../game_data/experience.json')
const { ErrorMessage } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args) => {
    let Current = args['current']
    let End = args['end']

    if (Current < 71 && End < 71 && Current !== End) {
        return new DiscordJS.MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle('Experience Calculator')
            .setThumbnail(Settings.Images.Thumbnails.Experience)
            .addFields({
                name: "Experience Gap",
                value: (Math.abs(ExperienceData[Current].Total - ExperienceData[End].Total)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            })
    } else if (Current > 999 && End > 71 && Current !== End) {
        return new DiscordJS.MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle('Experience Calculator')
            .setThumbnail(Settings.Images.Thumbnails.Experience)
            .addFields({
                name: "Experience Gap",
                value: (Math.abs(ExperienceData[Current].Total - End)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            })
    } else if (Current === End) {
        return ErrorMessage('Both inputs are equal, nothing to compare')
    } else if (Current < 1000 && Current > 70) {
        return ErrorMessage('Input is to high to be a level and too low to be an experience value')
    } else if (End < 1000 && End > 70) {
        return ErrorMessage('Input is to high to be a level and too low to be an experience value')
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings