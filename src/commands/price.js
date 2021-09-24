require('../utils')
const { Chart } = require('../classes/pricechart')
const { Search } = require('../classes/searchengine')
const { PriceInfo } = require('../classes/priceinfo')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const ItemIDs = ReadJson('./src/game_data/api/itemfromid.json')

module.exports = {
    data: {
        name: 'price',
        description: 'Returns price info of a specified item',
        options: [{
            name: 'item',
            description: 'What item to get the price of',
            required: true,
            type: 3
        }]
    },
    message: async (args) => {
        if (args['item'].length < 2 || args['item'].length > 100) {
            return { Type: "error", Content: ErrorMessage('Please keep the item input length between 3 and 100 characters'), Time: 5000 }
        }

        let items = [
            new Search().Results(args['item'])
        ]

        for (let i in items) {
            let item = items[i]
            let results = item.results

            if (results.length > 1) {
                return CreateSearchInput(results, args, 'item', 'price')
            } else if (item.error) {
                return { Type: 'error', Content: item.error }
            }

            items[i] = results[0].id || results[0].ID
        }

        let Item = items[0]

        let PriceData = new PriceInfo(ItemIDs[Item].ID)

        if (PriceData.PriceData.avg24hPrice === 0) {
            return {
                Type: "serverMessage",
                Content: new MessageEmbed()
                    .setColor(Settings.BotSettings.Color)
                    .setTitle(`${PriceData.PriceData.shortName} Price Data`)
                    .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/item_icons/${PriceData.PriceData.id}.png`)
                    .setDescription(`[Wiki Link To Item](${PriceData.PriceData.wikiLink}) \n **This item has no offers on the Flea Market**`)
                    .addFields(ResolveStrings([{
                        name: 'Highest Trader Sell',
                        value: `${PriceData.HighestTraderBuy[1]} at ${FormatPrice(PriceData.HighestTraderBuy[0])}/each`
                    }, {
                        name: 'Best Place To Sell',
                        value: `${PriceData.RecommendedSell}`
                    }]))
            }
        } else {
            let priceChart = new Chart({ range: 1 })

            priceChart.GeneratePoints(ItemIDs[Item].ID)
            let chart = await priceChart.RenderChart()

            let bestSell = PriceData.SellingPrices()

            return {
                Type: "serverMessage",
                Files: new MessageAttachment(chart, 'chart.png'),
                Content: new MessageEmbed()
                    .setColor(Settings.BotSettings.Color)
                    .setTitle(`${PriceData.PriceData.shortName} Price Data - ${FormatPrice(PriceData.PriceData.lastLowPrice)}`)
                    .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/item_icons/${PriceData.PriceData.id}.png`)
                    .setDescription(`[Wiki Link To Item](${PriceData.PriceData.wikiLink})`)
                    .addFields(ResolveStrings([{
                        name: 'Price Right Now',
                        value: FormatPrice(PriceData.PriceData.lastLowPrice),
                        inline: true
                    }, {
                        name: 'Price Per Slot',
                        value: FormatPrice(PriceData.PricePerSlot),
                        inline: true
                    }, {
                        name: 'Avg 24hr Price',
                        value: `${FormatPrice(PriceData.PriceData.avg24hPrice)} (${PriceData.PriceChange}%)`,
                        inline: true
                    }, {
                        name: 'Best Sells',
                        value: `**${bestSell[0].source}** at **${bestSell[0].price}** or ${bestSell[1].source} at ${bestSell[1].price}`
                    }, {
                        name: 'Best Buy',
                        value: `${CapitalizeWords(PriceData.BestBuy()[1])} at ${FormatPrice(PriceData.BestBuy()[0])}/each`
                    }]))
                    .setImage('attachment://chart.png')
            }
        }
    }
}