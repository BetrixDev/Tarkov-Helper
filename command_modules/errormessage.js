const Discord = require('discord.js');
const Responses = require('../settings.json')

const ErrorMessage = (Description, message) => {
    const NewMessage = new Discord.MessageEmbed()
        .setColor(Responses.BotSettings.ErrorColor)
        .setAuthor('Tarkov Helper', Responses.Images.Author)
        .setTitle('Error!')
        .setDescription(Description)
        .setThumbnail(Responses.Images.Thumbnails.Error)
    message.channel.send(NewMessage);
}

exports.ErrorMessage = ErrorMessage;