// Load modules
const fs = require('fs')

// Load command-modules
const { ErrorMessage } = require("../command_modules/errormessage")

// Load data
let Config = JSON.parse(fs.readFileSync('./config.json'))
const PossiblePrefixs = require('../settings.json').PossiblePrefixs
const Responses = require('../settings.json')

const Thumbnail = Responses.Images.Thumbnails.Settings
const AuthorImage = Responses.Images.Author

module.exports = {
    name: 'prefix',
    description: "Change the prefix that bot will respond to",
    execute(message, args, Discord) {
        console.log(message.guild.id)
        if (message.member.permissions.has("ADMINISTRATOR") && (PossiblePrefixs.includes(args[0]) === true)) {

            // Create new config file
            let UpdateConfig = Config
            UpdateConfig[message.guild.id].Prefix = args[0]

            // Write new data
            fs.writeFileSync('./config.json', JSON.stringify(UpdateConfig, null, 2))

            // Send message
            const newEmbed = new Discord.MessageEmbed()
                .setColor(Responses.BotSettings.Color)
                .setAuthor('Tarkov Helper', AuthorImage)
                .setTitle(`Prefix Set To ${args[0]}`)
                .setThumbnail(Thumbnail)
            message.channel.send(newEmbed);

        } else if (PossiblePrefixs.includes(args[0]) === false) {
            ErrorMessage('Prefix is not available for use', message)
        } else if (message.member.permissions.has("ADMINISTRATOR")) {
            //ErrorMessage('You do not have the require permissions to perform this action', message)
        }
    }
}