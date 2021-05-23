// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'price',
            description: 'Returns price info of a specified item',
            options: [{
                name: 'item',
                description: 'What item to get the price of',
                required: true,
                type: 3
            }]
        }
    },
    DMCommand: true
}

const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = require('../game_data/api/itemfromname.json')
const { PriceInfo } = require('../classes/priceinfo')
const Settings = require('../settings.json')
const { MessageEmbed } = require('discord.js')

// Command Functions
const CommandFunction = (args) => {
    if (args['item'].length < 2 || args['item'].length > 100) {
        return { Type: "Error", Content: ErrorMessage('Please keep the item input length between 3 and 100 characters'), Time: 5000 }
    }

    let Item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = Item.length
    if (Length === 1) {
        let PriceData = new PriceInfo(ItemFromName[Item[0]].ID)

        if (PriceData !== 'ERROR') {
            return {
                Type: "ServerMessage",
                Content: new MessageEmbed()
                    .setTitle(`${PriceData.PriceData.shortName} Price Data`)
                    .setThumbnail(`https://raw.githubusercontent.com/RatScanner/EfTIcons/master/uid/${PriceData.PriceData.id}.png`)
                    .setDescription(`[Wiki Link To Item](${PriceData.PriceData.wikiLink})`)
                    .addFields({
                        name: 'Price',
                        value: FormatNumber(PriceData.PriceData.avg24hPrice) + '₽',
                        inline: true
                    }, {
                        name: 'Price Per Slot',
                        value: FormatNumber(PriceData.PricePerSlot) + '₽',
                        inline: true
                    }, {
                        name: 'Flea Market Fee',
                        value: FormatNumber(PriceData.Fee) + '₽/each',
                        inline: true
                    }, {
                        name: 'Highest Trader Sell',
                        value: `${PriceData.HighestTraderBuy[1]} at ${FormatNumber(PriceData.HighestTraderBuy[0])}₽/each`
                    }, {
                        name: 'Best Place To Sell',
                        value: `${PriceData.RecommendedSell}`
                    })
                    .setFooter('Fee is calculated from an offer of 1 rouble less then the current price')
            }
        } else {
            return { Type: "Error", Content: ErrorMessage('Unable to grab price data please try again later'), Time: 5000 }
        }
    } else if (Length > 1 && Length < 25) {
        return {
            Type: "Error",
            Content: ErrorMessageField(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with multiple results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`, {
                name: 'Results',
                value: Item
            }),
            Time: 15000
        }
    } else if (Length > 25) {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
    } else {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
    }
}

const FormatNumber = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g, '$1,')
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings