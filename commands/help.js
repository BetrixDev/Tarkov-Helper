module.exports = {
    name: 'help',
    description: "Get help with how to use commands",
    execute(message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo1000x1000.png?token=AMYPLREYF46BL3I2ZGAX7Z277JJQQ')
        .setTitle('Help')
        .setDescription('All of the commands currently supported by Tarkov Helper')
        .addFields(
            {name: '!BitcoinFarm {AmountOfGPUS}', value: 'Returns the amount of Bitcoins and Roubles made per day from a Bitcoin farm.'}

        )
        message.channel.send(newEmbed);
    }

}