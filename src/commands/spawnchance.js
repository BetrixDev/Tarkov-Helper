require('../utils')

let SpawnChances = ReadJson('./src/game_data/spawnchances.json')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
const ItemData = ReadJson('./src/game_data/api/itemdata.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: {
        name: 'spawnchance',
        description: 'Gets the spawn chances of the specified item in containers',
        options: [{
            name: 'item',
            description: 'What item to get spawn chances of',
            required: true,
            type: 3
        }]
    },
    message: (args, { uid }) => {
        if (args['item'].length < 2 || args['item'].length > 100) {
            return { Type: "error", Content: ErrorMessage('Please keep the item input length between 3 and 100 characters'), Time: 5000 }
        }

        let Item = ItemSearchEngine(args['item'].toLowerCase())

        let Length = Item.length
        if (Length === 1) {
            let ItemID = ItemFromName[Item[0]].ID
            if (SpawnChances[ItemID] === undefined) {
                return {
                    Type: "error",
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
                    Type: "serverMessage",
                    Content: new MessageEmbed()
                        .setColor(Settings.BotSettings.Color)
                        .setTitle(`Spawn Percentages for: ${Item[0]}`)
                        .setDescription(`Listed below are all the possible containers that can spawn a **${ItemData[ItemID].ShortName}** and their spawn chances \n\n[Wiki Link to item](${ItemData[ItemID].WikiLink})`)
                        .setThumbnail(Settings.Images.Thumbnails.SpawnChance)
                        .addFields(ResolveStrings([{
                            name: 'Container',
                            value: Names,
                            inline: true
                        }, {
                            name: 'Percentages',
                            value: Percentages,
                            inline: true
                        }]))
                }
            }
        } else if (Length > 1 && Length < 25) {
            let array = require('../command_modules/search').CreateInput(Item, 'spawnchance', uid)
            return CreateSearchInput(array, args['item'])
        } else if (Length > 25) {
            return { Type: "error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
        } else {
            return { Type: "error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`), Time: 5000 }
        }
    }
}