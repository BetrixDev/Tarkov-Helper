// Command Config
const CommandSettings = {
    data: {
        name: 'price',
        description: 'Calculate the amount of money obtained from a certain amount of Graphics Cards',
        options: [{
            name: 'item',
            description: 'What item to get the price of',
            required: true,
            type: 3
        }]
    }
}

const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = require('../game_data/itemfromname.json')
const { GetPrice } = require('../command_modules/getprice')
const { MessageEmbed } = require('discord.js')

// Command Functions
const CommandFunction = async(args) => {
    if (args['item'].length < 2 || args['item'].length > 100) {
        return ErrorMessage('Please keep the item input length between 3 and 100 characters')
    }

    let Item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = Item.length

    if (Length === 1) {
        let PriceData = await GetPrice(ItemFromName[Item[0]].ID)
        console.log(PriceData)

        if (PriceData !== 'ERROR') {
            return new MessageEmbed()
                .setTitle(`${PriceData.shortName} Price Data`)
                .setThumbnail(PriceData.iconLink)
                .addFields({
                    name: 'Price',
                    value: FormatNumber(PriceData.avg24hPrice) + '₽',
                    inline: true
                }, {
                    name: 'Price Per Slot',
                    value: FormatNumber(PricePerSlot(PriceData.avg24hPrice, PriceData.width, PriceData.height)) + '₽',
                    inline: true
                }, {
                    name: 'Flea Market Fee',
                    value: FormatNumber(CalcFee(PriceData.basePrice, (PriceData.avg24hPrice - 1))) + '₽ per one',
                    inline: true
                }, {
                    name: 'Wiki Link',
                    value: `[Click Here](${PriceData.wikiLink})`,
                    inline: true
                })
                .setFooter('Fee is calculated from a offer of 1 rouble less then the current price')
        } else {
            return ErrorMessage('Unable to grab price data please try again later')
        }
    } else if (Length > 1 && Length < 25) {
        return ErrorMessageField(`Item search of \"${args['item'].toLowerCase()}\" came back with multiple results, please be more specific. [Click here](https://github.com/BetrixEdits/Tarkov-Helper/blob/master/game_data/itemarray.json) to see a list of all possible entries`, {
            name: 'Results',
            value: Item
        })
    } else if (Length > 25) {
        return ErrorMessage(`Item search of \"${args['item'].toLowerCase()}\" came back with over 25 results, please be more specific`)
    } else {
        return ErrorMessage(`Item search of \"${args['item'].toLowerCase()}\" came back with no results`)
    }
}

const PricePerSlot = (Price, W, H) => {
    let Slots = W * H
    return Math.round(Price / Slots)
}

// Function from tarkov-tools fee calculator script
const CalcFee = (basePrice, sellPrice, count = 1) => {
    let V0 = basePrice
    let VR = sellPrice
    let Ti = 0.05
    let Tr = 0.05
    let P0 = Math.log10(V0 / VR)
    let PR = Math.log10(VR / V0)
    let Q = count

    if (VR < V0) {
        P0 = Math.pow(P0, 1.08)
    }

    if (VR >= V0) {
        PR = Math.pow(PR, 1.08)
    }

    return Math.ceil(V0 * Ti * Math.pow(4, P0) * Q + VR * Tr * Math.pow(4, PR) * Q)
}

const FormatNumber = (n) => {
    return String(n).replace(/(.)(?=(\d{3})+$)/g, '$1,')
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings