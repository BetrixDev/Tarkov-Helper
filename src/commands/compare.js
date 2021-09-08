require('../utils')
const { MessageEmbed } = require('discord.js')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
const ItemFromID = ReadJson('./src/game_data/api/itemfromid.json')
const GameData = ReadJson('./src/game_data/api/itemdata.json')
const CompareList = ReadJson('./src/bot_data/comparelist.json')

module.exports = {
    data: {
        name: 'compare',
        description: 'Compares two items by finding any matching values and listing the differences',
        options: [{
            type: 3,
            name: "first-item",
            description: "First item to compare with",
            required: true
        }, {
            type: 3,
            name: "second-item",
            description: "Second item to compare with",
            required: true
        }]
    },
    message: async function(args) {

        let items = [
            ItemSearchEngine(args['first-item'].toLowerCase()),
            ItemSearchEngine(args['second-item'].toLowerCase())
        ]

        for (let i in items) {
            let item = items[i]
            let pos = i == 0 ? 'first' : 'second'

            if (item.length > 1 && item.length < 25) {
                return CreateSearchInput(item, args, `${pos}-item`, 'compare')
            } else if (item.length > 25) {
                return { Type: "error", Content: ErrorMessage(`Item search of \"${args[pos + '-item']}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
            } else if (item.length === 0) {
                return { Type: "error", Content: ErrorMessage(`Item search of \"${args[pos + '-item']}\" came back with no results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
            }

            items[i] = ItemFromName[item[0]].ID
        }

        let itemTraits = items.map(item => {
            return Object.keys(GameData[item].RawData._props)
        })

        let compareKeys = CompareList.map(trait => { return trait.key })
        itemTraits = itemTraits[0].filter(trait => {
            return itemTraits[1].includes(trait) && compareKeys.includes(trait)
        })

        let firstItemData = GameData[items[0]].RawData._props
        let secondItemData = GameData[items[1]].RawData._props
        let compairson = itemTraits.map(trait => {
            let firstValue = firstItemData[trait]
            let secondValue = secondItemData[trait]

            let comparisonData = CompareList.find(({ key }) => key === trait)
            let method = comparisonData.method || '>'
            let winner

            if (firstValue === secondValue) {
                winner = null
            } else if (eval(`${firstValue} ${method} ${secondValue}`)) {
                winner = 0
            } else {
                winner = 1
            }

            return [firstValue, secondValue, winner, comparisonData.name || trait]
        })

        let itemNames = [ItemFromID[items[0]].ShortName, ItemFromID[items[1]].ShortName]

        let firstItemField = compairson.map(matchup => {
            if (matchup[2] === 0) {
                return `**${matchup[0]}**`
            }
            return matchup[0]
        })
        let secondItemField = compairson.map(matchup => {
            if (matchup[2] === 1) {
                return `**${matchup[1]}**`
            }
            return matchup[1]
        })

        let valueField = compairson.map(matchup => {
            return matchup[3]
        })

        return {
            Type: 'serverMessage',
            Content: new MessageEmbed()
                .setColor(Settings.BotSettings.Color)
                .setTitle(`Comparing **${itemNames[0]}** & **${itemNames[1]}**`)
                .setDescription('The item with the **bolded value** in the row is the **winner** of the \"matchup\", when none are bold, it is a tie')
                .setThumbnail(Settings.Images.Thumbnails.Compare)
                .addFields(ResolveStrings([{
                    name: 'Value',
                    value: valueField,
                    inline: true
                }, {
                    name: itemNames[0],
                    value: firstItemField,
                    inline: true
                }, {
                    name: itemNames[1],
                    value: secondItemField,
                    inline: true
                }]))
        }
    }
}