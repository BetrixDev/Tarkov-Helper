module.exports = {
    name: 'help',
    description: "Get help with how to use commands",
    execute(message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50.png?token=AMYPLRG4G6UW3AQMC5BR7QC77JJ56')
        .setTitle('Help')
        .setDescription('All of the commands currently supported by Tarkov Helper')
        .addFields(
            {name: '!BitcoinFarm {AmountOfGPUS}', value: 'Returns the amount of Bitcoins and Roubles made per day from a Bitcoin farm.'}

        )
        message.channel.send(newEmbed);
    }

}