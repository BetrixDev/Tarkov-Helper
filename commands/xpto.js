var Settings = require('../settings.json')
var ExperienceData = require('../game_data/experience.json')
const { ErrorMessage } = require('../command_modules/errormessage')

module.exports = {
    name: 'xpto',
    description: "",
    execute(message, args, Discord) {
        if (args[0] < 71 && args[1] < 71 && args[0] !== args[1]) {
            let XPGap = (ExperienceData[args[0]].Total - ExperienceData[args[1]].Total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            SendMessage([
                { name: "Experience Gap", value: XPGap },
            ], Discord, message)
        } else if (args[0] < 71 && args[1] > 999 && args[0] !== args[1]) {
            let XPGap = (ExperienceData[args[0]].Total - args[1]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            SendMessage([
                { name: "Experience Gap", value: XPGap },
            ], Discord, message)
        } else if (args[0] === args[1]) {
            ErrorMessage('Both inputs are equal, nothing to compare')
        } else if (args[0] > 70 && args[0] < 1000) {
            ErrorMessage('Input is to high to be a level and too low to be an experience value')
        } else if (args[1] > 70 && args[1] < 1000) {
            ErrorMessage('Input is to high to be a level and too low to be an experience value')
        }
    }
}

function SendMessage(Fields, Discord, message) {
    const EmbededMessage = {
        color: Settings.BotSettings.Color,
        title: 'Experience Calculator',
        thumbnail: {
            url: Settings.Images.Thumbnails.Experience,
        },
        fields: Fields,
        footer: {
            text: Settings.Text.Experience.FooterText,
        },
    }
    message.channel.send({ embed: EmbededMessage })
}