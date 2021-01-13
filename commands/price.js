module.exports = {
    name: 'price',
    description: "Get help with how to use commands. Sytax: !COMMAND {CUSTOM USER INPUT FIELD}",
    execute(message, args, Discord){
        const ErrorMessage = new Discord.MessageEmbed()
        .setColor('RED')
        .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
        .setTitle('Error!')
        .setDescription('This command is not yet added')
        .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/ErrorLogo128x128.png?token=AMYPLRFFVREOV35APX7JGJC77JVEU')
        message.channel.send(ErrorMessage);
    }
}