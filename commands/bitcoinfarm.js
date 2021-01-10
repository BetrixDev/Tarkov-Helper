const axios = require('axios');


module.exports = {
    name: 'bitcoinfarm',
    description: "Get help with how to use commands. Sytax: !COMMAND {CUSTOM USER INPUT FIELD}",
    async execute(message, args, Discord){
        let getPrice = async () => {
            let response = await axios.get('https://api.coinbase.com/v2/prices/spot?currency=RUB');
            let Price = response.data;
            return Price;
        }
        let PriceValue = await getPrice();
        const BitcoinPriceTarkov =  Math.floor((PriceValue.data.amount * 0.19));
        const SelectedGPUS = args[0];
        if (SelectedGPUS > 50 || SelectedGPUS.isInteger() === false)
        {
            const ErrorMessage = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
            .setTitle('Error!')
            .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/BitcoinFarmLogo128x128.png?token=AMYPLRCWRRTB6UWB7CV7JKC77JS66')
            .addFields(
                {name: 'Error 1:', value: 'The input was not a number'},
                {name: 'Error 2:' , value: 'The input was over the maximum amount of GPUS possible in a Bitcoin Farm (50)'}

            )
            message.channel.send(ErrorMessage);
        }
        else
        {
            const newEmbed = new Discord.MessageEmbed()
            .setColor('#cecdc3')
            .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
            .setTitle('Bitcoin Farm Calculator')
            .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/BitcoinFarmLogo128x128.png?token=AMYPLRCWRRTB6UWB7CV7JKC77JS66')
            .addFields(
                {name: 'Bitcoin Price:', value: `₽${BitcoinPriceTarkov.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`},
                {name: 'Amount of GPUS:' , value: `${SelectedGPUS}`}

            )
            message.channel.send(newEmbed);
        }
    }
}