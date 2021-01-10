module.exports = {
    name: 'help',
    description: "Get help with how to use commands. Sytax: !COMMAND {CUSTOM USER INPUT FIELD}",
    execute(message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
        .setTitle('Help')
        .setDescription('All of the commands currently supported by Tarkov Helper')
        .addFields(
            {name: '!BitcoinFarm {AmountOfGPUS}', value: 'Returns the amount of Bitcoins and Roubles made per day from a Bitcoin farm.'}

        )
        message.channel.send(newEmbed);
    }

}