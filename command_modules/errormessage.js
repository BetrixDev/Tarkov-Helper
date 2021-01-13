const Discord = require('discord.js');

const ErrorMessage = (Description, message) => {
    const NewMessage = new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
        .setTitle('Error!')
        .setDescription(Description)
        .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/ErrorLogo128x128.png?token=AMYPLRFFVREOV35APX7JGJC77JVEU')
    message.channel.send(NewMessage);
}

exports.ErrorMessage = ErrorMessage;