// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'stat',
            description: 'Returns information about a specified item',
            options: [{
                name: 'item',
                description: 'Item to get info of',
                required: true,
                type: 3
            }]
        }
    },
    DMCommand: true
}

require('../utils')
const fs = require('fs')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
const { ItemInfo } = require('../classes/iteminfo')
const { MessageEmbed } = require('discord.js')

// Command Functions
const CommandFunction = async(args, { interaction, uid }) => {
    let Item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = Item.length

    if (Length === 1) {

        let ItemData = new ItemInfo(ItemFromName[Item[0]].ID)

        if (ItemData !== undefined) {
            return {
                Type: "ServerMessage",
                Content: new MessageEmbed()
                    .setColor(Settings.BotSettings.Color)
                    .setTitle(`${ItemData.ShortName} Stats`)
                    .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/item_icons/${ItemFromName[Item[0]].ID}.png`)
                    .setDescription(`${ItemData.Description}\n[Wiki Link To Item](${ItemData.WikiLink})`)
                    .setImage(ItemData.SpecificData.Image || '')
                    .addFields(ItemData.SpecificData.Fields)
                    .setFooter(ItemData.SpecificData.Footer || '')
            }
        } else {
            return { Type: "Error", Content: ErrorMessage('Unable to grab item data please try again later'), Time: 5000 }
        }
    } else if (Length > 1 && Length < 25) {
        let array = require('../command_modules/search').CreateInput(Item, CommandSettings.CommandData.data.name, uid)
        return CreateSearchInput(array, args['item'])
    } else if (Length > 25) {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific.  [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 10000 }
    } else {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 10000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings