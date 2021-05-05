// Command Config
const CommandSettings = {
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
}

const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = require('../game_data/api/itemfromname.json')
const { ItemInfo } = require('../classes/iteminfo')
const { MessageEmbed } = require('discord.js')
const Settings = require('../settings.json')

// Command Functions
const CommandFunction = async(args) => {
    let Item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = Item.length

    if (Length === 1) {
        let ItemData = new ItemInfo(ItemFromName[Item[0]].ID)

        if (ItemData !== undefined) {
            return new MessageEmbed()
                .setTitle(`${ItemData.ShortName} Stats`)
                .setThumbnail(`https://raw.githubusercontent.com/RatScanner/EfTIcons/master/uid/${ItemFromName[Item[0]].ID}.png`)
                .setDescription(`${ItemData.Description} \n[Wiki Link To Item](${ItemData.WikiLink})`)
                .setImage(ItemData.SpecificData.Image || '')
                .addFields(ItemData.SpecificData.Fields)
                .setFooter(ItemData.SpecificData.Footer || '')
        } else {
            return ErrorMessage('Unable to grab item data please try again later')
        }
    } else if (Length > 1 && Length < 25) {
        return ErrorMessageField(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with multiple results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`, {
            name: 'Results',
            value: Item
        })
    } else if (Length > 25) {
        return ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific.  [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`)
    } else {
        return ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`)
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings