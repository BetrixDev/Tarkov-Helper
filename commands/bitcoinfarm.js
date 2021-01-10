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
        const BitcoinPriceTarkovFormat =  Math.floor((PriceValue.data.amount * 0.19)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const SelectedGPUS = args[0];
        const BitcoinPriceTarkov = PriceValue.data.amount;
        const BTCPerDay = (24 / Math.pow((0.04137931 - 0) + ((SelectedGPUS - 1) - 1) / ( 49 - 0)* (0.10386397 - 0), -1));
        const RUBPerDay = (Math.floor((24 / Math.pow((0.04137931 - 0) + ((args[0] - 1) - 1) / ( 49 - 0)* (0.10386397 - 0), -1)))*Math.floor(PriceValue.data.amount));
        if (isNaN(SelectedGPUS) === true)
        {
            const ErrorMessage = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
            .setTitle('Error!')
            .setDescription('The input was not a number')
            .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/ErrorLogo128x128.png?token=AMYPLRFFVREOV35APX7JGJC77JVEU')
            message.channel.send(ErrorMessage);
        }
        else if (SelectedGPUS > 50)
        {
            const ErrorMessage = new Discord.MessageEmbed()
            .setColor('RED')
            .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
            .setTitle('Error!')
            .setDescription('The input was over the maximum amount of GPUS possible in a Bitcoin Farm (50)')
            .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/ErrorLogo128x128.png?token=AMYPLRFFVREOV35APX7JGJC77JVEU')
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
                {name: 'Bitcoin Price:', value: `₽${BitcoinPriceTarkovFormat}`},
                {name: 'Amount of GPUS:' , value: `${SelectedGPUS}`},
                {name: 'Bitcoins Per Day:', value: `${BTCPerDay}`},
                {name: 'Roubles Per Day:', value: `${RUBPerDay}`}
            )
            message.channel.send(newEmbed);
        }
    }
}