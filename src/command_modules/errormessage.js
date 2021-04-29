const DiscordJS = require('discord.js')
const Settings = require('../settings.json')

const ErrorMessage = (Message, Footer = '') => {
    return new DiscordJS.MessageEmbed()
        .setColor(Settings.BotSettings.ErrorColor)
        .setTitle('Error!')
        //.setThumbnail(Settings.Images.Thumbnails.Error)
        .setDescription(Message)
        .setFooter(Footer)
}

const ErrorMessageField = (Message, Fields, Footer = '') => {
    return new DiscordJS.MessageEmbed()
        .setColor(Settings.BotSettings.ErrorColor)
        .setTitle('Error!')
        //.setThumbnail(Settings.Images.Thumbnails.Error)
        .setDescription(Message)
        .addFields(Fields)
        .setFooter(Footer)
}

exports.ErrorMessage = ErrorMessage
exports.ErrorMessageField = ErrorMessageField