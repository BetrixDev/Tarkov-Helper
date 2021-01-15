const { ErrorMessage } = require("../command_modules/errormessage")
const Config = require('../config.json')
const PossiblePrefixs = require('../settings.json').PossiblePrefixs
const Responses = require('../settings.json')

const Thumbnail = Responses.Images.Thumbnails.Settings
const AuthorImage = Responses.Images.Author

module.exports = {
    name: 'prefix',
    description: "Change the prefix that bot will respond to",
    execute(message, args, Discord) {
        if (message.member.permissions.has("ADMINISTRATOR") && (PossiblePrefixs.includes(args[0]) === true)) {
            Config[message.guild.id].Prefix = args[0]
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