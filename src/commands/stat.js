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

const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = require('../game_data/api/itemfromname.json')
const { ItemInfo } = require('../classes/iteminfo')
const { MessageEmbed } = require('discord.js')
const Settings = require('../settings.json')

// Command Functions
const CommandFunction = async(args, obj) => {
    let Item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = Item.length

    if (Length === 1) {
        let ItemData = new ItemInfo(ItemFromName[Item[0]].ID)

        if (ItemData !== undefined) {
            return {
                Type: "ServerMessage",
                Content: new MessageEmbed()
                    .setTitle(`${ItemData.ShortName} Stats`)
                    .setThumbnail(`https://raw.githubusercontent.com/RatScanner/EfTIcons/master/uid/${ItemFromName[Item[0]].ID}.png`)
                    .setDescription(`${ItemData.Description} \n[Wiki Link To Item](${ItemData.WikiLink})`)
                    .setImage(ItemData.SpecificData.Image || '')
                    .addFields(ItemData.SpecificData.Fields)
                    .setFooter(ItemData.SpecificData.Footer || '')
            }
        } else {
            return { Type: "Error", Content: ErrorMessage('Unable to grab item data please try again later'), Time: 5000 }
        }
    } else if (Length > 1 && Length < 25) {
        let uid = obj.interaction.member.user.id
        let Array = require('../command_modules/search').CreateInput(Item, 'stat', uid)
        return {
            Type: "Error",
            Content: new MessageEmbed()
                .setTitle('Error')
                .setColor(Settings.BotSettings.ErrorColor)
                .setDescription(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with multiple results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
                .addFields({ name: 'Results', value: Array })
        }
    } else if (Length > 25) {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific.  [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 10000 }
    } else {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 10000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings