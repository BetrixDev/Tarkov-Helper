// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'search',
            description: 'Returns all items and their ids from a search will private message',
            options: [{
                name: 'item',
                description: 'Search Query',
                required: true,
                type: 3
            }]
        }
    },
    DMCommand: true
}

const fs = require('fs')
const ItemFromName = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromname.json'))
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const { SearchEngine } = require('../command_modules/searchengine')
const { MessageEmbed } = require('discord.js')
const Settings = require('../settings.json')

// Command Functions
const CommandFunction = async(args) => {
    let Results = SearchEngine(args['item'])

    if (Results.length > 50) {
        return { Type: "Error", Content: ErrorMessage('Search came back with too many items and will surpase message character limit, please be more specific') }
    }

    let Names = new Array()
    let IDs = new Array()

    for (const Item of Results) {
        Names.push(TruncateString(Item, 40))
        IDs.push(ItemFromName[Item].ID)
    }

    return {
        Type: "DirectMessage",
        Content: new MessageEmbed()
            .setTitle(`Search Results of: ${args['item']}`)
            .addFields({
                name: 'Item Name',
                value: Names,
                inline: true
            }, {
                name: 'Item ID',
                value: IDs,
                inline: true
            })
    }
}

function TruncateString(str, num) {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings