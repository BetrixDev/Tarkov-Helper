module.exports = {
    name: 'help',
    description: "Get help with how to use commands. Sytax: !COMMAND {CUSTOM USER INPUT FIELD}",
    execute(message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#cecdc3')
        .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
        .setTitle('Help')
        .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/QuestionLogo128x128.png')
        .setDescription('All of the commands currently supported by Tarkov Helper \n[Click here to view the full documentation on commands](https://github.com/BetrixEdits/Tarkov-Helper#commands)')
        .addFields(
            {name: '!BitcoinFarm {AmountOfGPUS}', value: 'Returns the amount of Bitcoins and Roubles made per day from a Bitcoin farm. ex: !bitcoinfarm 50'},
            {name: '!BitcoinFarm Compare {AmountOfGPUS} {AmountOfGPUS2}', value: 'Built in compare function for the bitcoinfarm command. ex: !bitcoinfarm compare 1 10'},
            {name: '!map {MAP} {SPECIFIC MAP}', value: 'Returns an image of the map specified. ex: !map customs spawns'}
        )
        message.channel.send(newEmbed);
    }
}