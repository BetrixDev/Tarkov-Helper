const { GetBitcoinPrice } = require('../command_modules/bitcoinapi');
const { ErrorMessage } = require('../command_modules/errormessage');

module.exports = {
    name: 'bitcoinfarm',
    description: "Get help with how to use commands. Sytax: !COMMAND {CUSTOM USER INPUT FIELD}",
    async execute(message, args, Discord) {
        const PriceValue = await GetBitcoinPrice()
        if (args[0] === 'c' || args[0] === 'compare') // Comparing mode (Needs some work)
        {
            let BitcoinPriceTarkovFormat = Math.floor((PriceValue.data.amount * 0.19)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            let SelectedGPUS = args[1]
            let BTCPerDay = (24 / Math.pow((0.04137931 - 0) + ((SelectedGPUS - 1) - 1) / (49 - 0) * (0.10386397 - 0), -1));
            let RUBPerDay = Math.floor((BTCPerDay * Math.floor((PriceValue.data.amount * 0.19)))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            let SelectedGPUSComp = args[2]
            let BTCPerDayComp = (24 / Math.pow((0.04137931 - 0) + ((SelectedGPUSComp - 1) - 1) / (49 - 0) * (0.10386397 - 0), -1));
            let RUBPerDayComp = Math.floor((BTCPerDayComp * Math.floor((PriceValue.data.amount * 0.19)))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (isNaN(SelectedGPUS) === true || isNaN(SelectedGPUSComp) === true) {
                ErrorMessage('The input was not a number', message)
            } else if (SelectedGPUS > 50 || SelectedGPUSComp > 50) {
                ErrorMessage('The input was over the maximum amount of GPUS possible in a Bitcoin Farm (50)', message)
            } else {
                const newEmbed = new Discord.MessageEmbed()
                    .setColor('#cecdc3')
                    .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
                    .setTitle('Bitcoin Farm Calculator')
                    .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/BitcoinFarmLogo128x128.png?token=AMYPLRCWRRTB6UWB7CV7JKC77JS66')
                    .setDescription('Compare Mode')
                    .addFields({ name: 'Bitcoin Price:', value: `₽${BitcoinPriceTarkovFormat}` }, { name: 'Difference in GPUS:', value: `${(SelectedGPUSComp - SelectedGPUS)}` }, { name: 'Difference in Bitcoins Per Day:', value: `${(BTCPerDayComp - BTCPerDay)}` }, { name: 'Difference in Roubles Per Day:', value: `₽${(Math.floor((BTCPerDayComp * Math.floor((PriceValue.data.amount * 0.19)))) - Math.floor((BTCPerDay * Math.floor((PriceValue.data.amount * 0.19))))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` })
                message.channel.send(newEmbed);
            }
        } else // Default mode
        {
            const BitcoinPriceTarkovFormat = Math.floor((PriceValue.data.amount * 0.19)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            const SelectedGPUS = args[0];
            const BTCPerDay = (24 / Math.pow((0.04137931 - 0) + ((SelectedGPUS - 1) - 1) / (49 - 0) * (0.10386397 - 0), -1));
            const RUBPerDay = Math.floor((BTCPerDay * Math.floor((PriceValue.data.amount * 0.19)))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (isNaN(SelectedGPUS) === true) {
                ErrorMessage('The input was not a number', message)
            } else if (SelectedGPUS > 50) {
                ErrorMessage('The input was over the maximum amount of GPUS possible in a Bitcoin Farm (50)', message)
            } else {
                const newEmbed = new Discord.MessageEmbed()
                    .setColor('#cecdc3')
                    .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
                    .setTitle('Bitcoin Farm Calculator')
                    .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/BitcoinFarmLogo128x128.png?token=AMYPLRCWRRTB6UWB7CV7JKC77JS66')
                    .addFields({ name: 'Bitcoin Price:', value: `₽${BitcoinPriceTarkovFormat}` }, { name: 'Amount of GPUS:', value: `${SelectedGPUS}` }, { name: 'Bitcoins Per Day:', value: `${BTCPerDay}` }, { name: 'Roubles Per Day:', value: `₽${RUBPerDay}` })
                message.channel.send(newEmbed);
            }
        }
    }
}