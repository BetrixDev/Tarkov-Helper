const fs = require('fs')
require('../utils')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
const ItemFromID = ReadJson('./src/game_data/api/itemfromid.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: {
        name: 'notifyremove',
        description: 'Removes specific entries from your notify list, see pricenotify for more details',
        options: [{
            name: 'item',
            description: 'Item to remove, USE CLEAR AS THE ITEM TO REMOVE ALL ITEMS',
            required: true,
            type: 3
        }]
    },
    message: (args, { uid }) => {
        if (args['item'].length < 2 || args['item'].length > 100) {
            return { Type: "error", Content: ErrorMessage('Please keep the item input length between 3 and 100 characters') }
        }

        let item = [args['item'].toLowerCase()]
        if (item[0] !== 'clear') {
            item = ItemSearchEngine(args['item'].toLowerCase())
        }

        let Length = item.length
        if (Length === 1) {
            let notifyData = new Object(ReadJson('./src/bot_data/notifylist.json'))

            if (item[0] === 'clear') {
                notifyData[uid] = undefined

                fs.writeFileSync('./src/bot_data/notifylist.json', JSON.stringify(notifyData, null, 4))

                return {
                    Type: "ephemeral",
                    Content: new MessageEmbed()
                        .setTitle('Removed All Notifications!')
                        .setColor(Settings.BotSettings['Alt-Color'])
                        .setThumbnail(Settings.Images.Thumbnails.NotifyRemove)
                        .setDescription('You now have 5 open notifications slots')
                }
            } else {
                item = ItemFromName[item].ID

                notifyData[uid] = notifyData[uid].filter(entry => {
                    return entry.id !== item
                })

                fs.writeFileSync('./src/bot_data/notifylist.json', JSON.stringify(notifyData, null, 4))

                return {
                    Type: "ephemeral",
                    Content: new MessageEmbed()
                        .setTitle(`Removed Notification for ${ItemFromID[item].ShortName}`)
                        .setColor(Settings.BotSettings['Alt-Color'])
                        .setThumbnail(Settings.Images.Thumbnails.NotifyRemove)
                        .setDescription(`You now have ${5 - notifyData[uid].length} open notifications slots`)
                }
            }
        } else if (Length > 1 && Length < 25) {
            let array = require('../command_modules/search').CreateInput(item, 'notifyremove', uid)
            return CreateSearchInput(array, args['item'])
        } else if (Length > 25) {
            return { Type: "error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
        } else {
            return { Type: "error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
        }
    }
}