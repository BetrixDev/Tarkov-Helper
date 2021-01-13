const Discord = require('discord.js');

const Thumbnail = "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/MapLogo128x128.png"
const AuthorImage = "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK"
const FooterText = "Map image taken from the EFT WIKI"

const MapMessage = (Title, Image, FullRes, message) => {
    const newEmbed = new Discord.MessageEmbed()
        .setColor('#cecdc3')
        .setAuthor('Tarkov Helper', AuthorImage)
        .setTitle(Title)
        .setThumbnail(Thumbnail)
        .addFields({ name: 'For the full-res image click below', value: `[Full Resolution Image](${FullRes})` })
        .setImage(Image)
        .setFooter(FooterText)
    message.channel.send(newEmbed);
}

exports.MapMessage = MapMessage;