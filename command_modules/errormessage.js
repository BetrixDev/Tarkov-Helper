const DiscordJS = require('discord.js')
const Settings = require('../settings.json')

const ErrorMessage = (Message) => {
    return new DiscordJS.MessageEmbed()
        .setColor(Settings.BotSettings.ErrorColor)
        .setTitle('Error!')
        .setThumbnail(Settings.Images.Thumbnails.Error)
        .setDescription(Message)
}

const ErrorMessageField = (Message, Fields) => {
    return new DiscordJS.MessageEmbed()
        .setColor(Settings.BotSettings.ErrorColor)
        .setTitle('Error!')
        .setThumbnail(Settings.Images.Thumbnails.Error)
        .setDescription(Message)
        .addFields(Fields)
}

exports.ErrorMessage = ErrorMessage
exports.ErrorMessageField = ErrorMessageField