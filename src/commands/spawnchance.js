const fs = require('fs')

let SpawnChances = JSON.parse(fs.readFileSync('./src/game_data/spawnchances.json'))
const { ErrorMessage } = require('../command_modules/errormessage')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromname.json'))
const ItemData = JSON.parse(fs.readFileSync('./src/game_data/api/itemdata.json'))
const Settings = require('../settings.json')
const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'spawnchance',
            description: 'Gets the spawn chances of the specified item in containers',
            options: [{
                name: 'item',
                description: 'What item to get spawn chances of',
                required: true,
                type: 3
            }]
        }
    }
}

// Command Functions
const CommandFunction = (args, { interaction }) => {
    if (args['item'].length < 2 || args['item'].length > 100) {
        return { Type: "Error", Content: ErrorMessage('Please keep the item input length between 3 and 100 characters'), Time: 5000 }
    }

    let Item = ItemSearchEngine(args['item'].toLowerCase())

    let Length = Item.length
    if (Length === 1) {
        let ItemID = ItemFromName[Item[0]].ID
        if (SpawnChances[ItemID] === undefined) {
            return {
                Type: "Error",
                Content: ErrorMessage('Specifed item does not spawn in any containers')
            }
        } else {
            let Chances = SpawnChances[ItemID]
            let Sorted = new Array()
            for (let ContainerName in Chances) {
                Sorted.push({ ContainerName, Percentage: Chances[ContainerName] })
            }
            Sorted.sort(function(a, b) {
                return Number(b['Percentage'].replace('%', '')) - Number(a['Percentage'].replace('%', ''))
            })

            let Names = new Array()
            let Percentages = new Array()

            Sorted.forEach(Container => {
                Names.push(Container.ContainerName)
                Percentages.push(Container.Percentage)
            })

            return {
                Type: "ServerMessage",
                Content: new MessageEmbed()
                    .setTitle(`Spawn Percentages for: ${Item[0]}`)
                    .setDescription(`Listed below are all the possible containers that can spawn a **${ItemData[ItemID].ShortName}** and their spawn chances \n\n[Wiki Link to item](${ItemData[ItemID].WikiLink})`)
                    .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/SpawnChance200x200.png')
                    .addFields({
                        name: 'Container',
                        value: Names,
                        inline: true
                    }, {
                        name: 'Percentages',
                        value: Percentages,
                        inline: true
                    })
            }
        }
    } else if (Length > 1 && Length < 25) {
        let uid = interaction.member.user.id
        let Array = require('../command_modules/search').CreateInput(Item, 'price', uid)
        return {
            Type: "Error",
            Content: new MessageEmbed()
                .setTitle('Error')
                .setColor(Settings.BotSettings.ErrorColor)
                .setDescription(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with multiple results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
                .addFields({ name: 'Results', value: Array })
        }
    } else if (Length > 25) {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
    } else {
        return { Type: "Error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings