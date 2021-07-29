const fs = require('fs')
require('../utils')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
const ItemFromID = ReadJson('./src/game_data/api/itemfromid.json')
const { PriceInfo } = require('../classes/priceinfo')
const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'pricenotify',
            description: 'Notifies you when a specfied item drops below the specified amount',
            options: [{
                name: 'item',
                description: 'Item to check',
                required: true,
                type: 3
            }, {
                name: 'maximum',
                description: 'Maximum price to pay for the item',
                required: true,
                type: 4
            }]
        }
    }
}

// Command Functions
const CommandFunction = (args, { interaction, uid }) => {
    if (args['item'].length < 2 || args['item'].length > 100) {
        return { Type: "Error", Content: ErrorMessage('Please keep the item input length between 3 and 100 characters') }
    }

    let item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = item.length
    if (Length === 1) {
        item = ItemFromName[item].ID
        let max = args['maximum']

        let priceData = new PriceInfo(item)
        let currentPrice = priceData.PriceData.avg24hPrice

        if (currentPrice < max) {
            return {
                Type: "Error",
                Content: ErrorMessage('The item you want to be notified about is already less than the set amount')
            }
        }

        let notifyData = new Object(ReadJson('./src/bot_data/notifylist.json'))

        if (notifyData[uid] === undefined) { notifyData[uid] = new Array() } // User doesn't have any current notifications so we create an array

        if (notifyData[uid].length >= 5) { // User has too many open notifications
            console.log(notifyData[uid])
            return {
                Type: "Error",
                Content: ErrorMessage(`
                • You already have too many open notifications
                • Remove an entry by using the \`/notifyremove\` command, use \"clear\" as the item to clear all entries
                \`\`\`json
                    ${JSON.stringify(notifyData[uid], null, 2)}
                \`\`\`
                `)
            }
        }

        let matches = notifyData[uid].filter(entry => entry.id === item)
        if (matches.length > 0) { // Notification for specified item already exists
            return {
                Type: "Error",
                Content: ErrorMessage(`
                • You already have a notification for this item created
                • Remove an entry by using the \`/notifyremove\` command, use \"clear\" as the item to clear all entries
                \`\`\`json
                    ${JSON.stringify(matches[0], null, 2)}
                \`\`\`
                `)
            }
        }

        notifyData[uid].push({
            name: ItemFromID[item].Name,
            id: item,
            max: max
        })

        fs.writeFileSync('./src/bot_data/notifylist.json', JSON.stringify(notifyData, null, 4))

        return {
            Type: "Ephemeral",
            Content: new MessageEmbed()
                .setTitle('Notification Created!')
                .setColor(Settings.BotSettings['Alt-Color'])
                .setThumbnail(Settings.Images.Thumbnails.PriceNotify)
                .setDescription(`
                Notification created for ${ItemFromID[item].ShortName}, you will be **direct messaged** when the item's price drops below ${FormatPrice(max)}!
                
                *To remove this notification use:*
                \`/notifyremove item:${item}\`
                `)
        }

    } else if (Length > 1 && Length < 25) {
        let array = require('../command_modules/search').CreateInput(Item, CommandSettings.CommandData.data.name, uid)
        return CreateSearchInput(array, args['item'])
    } else if (Length > 25) {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
    } else {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings