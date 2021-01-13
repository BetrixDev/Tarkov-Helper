const Discord = require('discord.js');
const Responses = require('../settings.json')

const Thumbnail = Responses.Images.Thumbnails.Map
const AuthorImage = Responses.Images.Author
const FooterText = Responses.Text.Map.FooterText

const MapMessage = (Title, Image, FullRes, message) => {
    const newEmbed = new Discord.MessageEmbed()
        .setColor(Responses.BotSettings.Color)
        .setAuthor('Tarkov Helper', AuthorImage)
        .setTitle(Title)
        .setThumbnail(Thumbnail)
        .addFields({ name: 'For the full-res image click below', value: `[Full Resolution Image](${FullRes})` })
        .setImage(Image)
        .setFooter(FooterText)
    message.channel.send(newEmbed);
}

exports.MapMessage = MapMessage;