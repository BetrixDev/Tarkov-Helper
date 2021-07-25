require('../utils')
const { MessageEmbed } = require('discord.js')
const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
const ItemData = ReadJson('./src/game_data/api/itemdata.json')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'needforquest',
            description: 'Shows if the specified item is needed for a quest',
            options: [{
                type: 3,
                name: 'item',
                description: 'Item to show dependencies for',
                required: true
            }]
        }
    }
}

// Command Functions
const CommandFunction = (args, obj) => {
    let Item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = Item.length

    if (Length === 1) {
        let Amounts = QuestItems(ItemFromName[Item].ID)

        return {
            Type: "ServerMessage",
            Content: new MessageEmbed()
                .setColor(Settings.BotSettings.Color)
                .setTitle(`Quest Dependencies for ${ItemFromName[Item].ShortName}`)
                .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/item_icons/${ItemFromName[Item].ID}.png`)
                .setDescription(`[Wiki Link](${ItemData[ItemFromName[Item].ID].WikiLink}) to item\n\n${ItemFromName[Item].ShortName} is needed in the following quests:\n${Amounts.UsedQuests}`)
                .addFields({
                    name: 'Find in Raid',
                    value: Amounts.FindInRaid,
                    inline: true
                }, {
                    name: 'Non FIR',
                    value: Amounts.Collect,
                    inline: true
                }, {
                    name: 'Amount to Place',
                    value: Amounts.Place,
                    inline: true
                })
        }

    } else if (Length > 1 && Length < 25) {
        let uid = obj.interaction.member.user.id
        let Array = require('../command_modules/search').CreateInput(Item, 'needforquest', uid)
        return {
            Type: "Error",
            Content: new MessageEmbed()
                .setTitle('Error')
                .setThumbnail(Settings.Images.Thumbnails.Search)
                .setColor(Settings.BotSettings['Alt-Color'])
                .setDescription(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with multiple results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
                .addFields({ name: 'Results', value: Array })
        }
    } else if (Length > 25) {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
    } else {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
    }
}

function QuestItems(item) {
    let QuestData = ReadJson('./src/game_data/api/quests.json')

    let UsedQuests = new Array()
    let FindInRaid = 0
    let Collect = 0
    let Place = 0

    for (const QuestName in QuestData) {
        let Quest = QuestData[QuestName]

        if (Quest.Objectives !== undefined) {
            for (const Objective of Quest.Objectives) {
                if (Objective.target === item) {
                    UsedQuests.push(`**${Quest.title}**`)
                    if (Objective.type === 'find') {
                        FindInRaid = FindInRaid + Objective.number
                    }
                    if (Objective.type === 'collect') {
                        Collect = Collect + Objective.number
                    }
                    if (Objective.type === 'place') {
                        Place = Place + Objective.number
                    }
                }
            }
        }

    }

    if (UsedQuests.length < 1) {
        UsedQuests = ['**No Quests**']
    }

    return { FindInRaid: FindInRaid, Collect: Collect, Place: Place, UsedQuests: UsedQuests.join('\n') }
}


exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings