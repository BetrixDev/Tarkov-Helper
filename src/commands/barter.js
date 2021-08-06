require('../utils')
const { BarterInfo } = require('../classes/barterinfo')
const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
const { ItemSearchEngine } = require('../command_modules/itemsearchengine')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: {
        name: 'barter',
        description: 'Calculates the price and profit of a specified barter',
        options: [{
            name: 'item',
            description: 'What item to get the price of',
            required: true,
            type: 3
        }]
    },
    message: function(args, obj) {
        let BarterData = ReadJson('./src/game_data/api/barters.json')

        if (args['item'].length < 2 || args['item'].length > 100) {
            return { Type: "error", Content: ErrorMessage('Please keep the item input length between 3 and 100 characters') }
        }

        let Item = ItemSearchEngine(args['item'].toLowerCase())

        let Length = Item.length
        if (Length === 1) {
            BarterData = BarterData[ItemFromName[Item[0]].ID]
            let Barter


            const BarterConfirmation = () => {
                let Message = new Array()
                for (const i in BarterData) {
                    let pos = Number(i) + 1
                    let Ingredients = new Array()

                    for (const Ingredient of BarterData[i].RequiredItems) {
                        Ingredients.push(`${Ingredient.Amount} ${Ingredient.ShortName}`)
                    }
                    Message.push(`${pos}-Ingredients: ${Ingredients.join(', ')}`)
                }

                return CreateSearchInput(Message, args, 'barter', 'barter')
            }

            if (obj === undefined) {
                return BarterConfirmation()
            } else if (obj.Barter !== undefined) {
                Barter = BarterData[obj.Barter]
            } else if (args['barter'] !== undefined) {
                Barter = BarterData[Number(args['barter']) - 1]
            } else if (BarterData.length === 1) {
                Barter = BarterData[0]
            } else {
                return BarterConfirmation()
            }

            let ExtraData = new BarterInfo(Barter)

            return {
                Type: "serverMessage",
                Content: new MessageEmbed()
                    .setColor(Settings.BotSettings.Color)
                    .setTitle(`${Barter.Reward.ShortName} Barter`)
                    .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/item_icons/${Barter.Reward.ID}.png`)
                    .setDescription(`[Wiki Link To Item](${Barter.Reward.WikiLink}) \n\n **${Barter.Trader.replace('LL', 'Loyalty Level ')}** is required for this barter\n\u200B`)
                    .addFields(ResolveStrings([{
                        name: 'Items',
                        value: ExtraData.FormattedIngredients(),
                        inline: true
                    }, {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    }, {
                        name: 'Flea Market Price',
                        value: ExtraData.FleaPrice().Price,
                        inline: true
                    }, {
                        name: 'Barter Total',
                        value: FormatPrice(ExtraData.BarterPrice()),
                        inline: true
                    }, {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    }, {
                        name: 'Barter Profit',
                        value: ExtraData.BarterProfit(),
                        inline: true
                    }]))
            }

        } else if (Length > 1 && Length < 25) {
            return CreateSearchInput(Item, args, 'item', 'barter')
        } else if (Length > 25) {
            return { Type: "error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with over 25 results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
        } else {
            return { Type: "error", Content: ErrorMessage(`Item search of \"${args['item'].toLowerCase().replace('short=','')}\" came back with no results. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries`) }
        }
    }
}