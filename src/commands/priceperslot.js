const fs = require('fs')

let PriceData = JSON.parse(fs.readFileSync('./src/game_data/api/pricedata.json'))

const { ErrorMessage } = require('../command_modules/errormessage')
const FormatPrice = require('../command_modules/formatprice')
const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'priceperslot',
            description: 'Returns all items within the specified price per slot value',
            options: [{
                name: 'minimum',
                description: 'minimum price per slot',
                required: true,
                type: 4
            }, {
                name: 'maximum',
                description: 'maximum price per slot',
                required: true,
                type: 4
            }]
        }
    }
}

// Command Functions
const CommandFunction = (args) => {
    let min = args['minimum']
    let max = args['maximum']

    let items = new Array()

    for (let i in PriceData) {
        let item = PriceData[i].Item

        if (item.PricePerSlot > min && item.PricePerSlot < max) {
            items.push({ name: item.name, id: item.id, pricePerSlot: item.PricePerSlot })
        }
    }

    items = items.sort(function(a, b) {
        return b['pricePerSlot'] - a['pricePerSlot']
    })

    itemnames = items.map(item => { return item.name })
    itemprices = items.map(item => { return FormatPrice(item.pricePerSlot) })

    if (items.length > 30) {
        return {
            Type: 'Error',
            Content: ErrorMessage('Too many items within that range, please pick and smaller range')
        }
    }

    return {
        Type: 'ServerMessage',
        Content: new MessageEmbed()
            .setTitle(`Price Per Slot Range: ${FormatPrice(min)} - ${FormatPrice(max)}`)
            .addFields({
                name: 'Items',
                value: itemnames,
                inline: true
            }, {
                name: 'Prices',
                value: itemprices,
                inline: true
            })
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings