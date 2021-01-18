const { ErrorMessage } = require('../command_modules/errormessage');
const Settings = require('../settings.json')
const fs = require('fs');
var ItemNames = require('../game_data/itemnames.json')
var Items = require('../game_data/items.json');
const urlExist = require('url-exist');

module.exports = {
    name: 'stat',
    description: "Returns the stats of the item specified",
    async execute(message, args, Discord) {
        let SearchItem = ""
        for (let Arg in args) {
            SearchItem = SearchItem + " " + args[Arg]
        }
        if (SearchItem !== undefined) {
            for (const Item in ItemNames) {
                if (Item.includes(SearchItem)) {
                    let ItemID = ItemNames[Item].ID
                    let ItemFullName = Items[ItemID]._name
                    let ItemData = Items[ItemID]._props
                    if (ItemFullName.includes('patron_') === true) {
                        let ImageThumbnail = ``
                        if (await urlExist(`https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemFullName}.png`)) {
                            ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemFullName}.png`
                        } else if (await urlExist(`https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemID}.png`)) {
                            ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemID}.png`
                        } else {
                            ImageThumbnail = 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/QuestionLogo128x128.png'
                        }
                        const newEmbed = new Discord.MessageEmbed()
                            .setColor('#cecdc3')
                            .setAuthor('Tarkov Helper', 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo50x50SmallText.png?token=AMYPLRE73XI3MEKDQDCTJX277JKCK')
                            .setTitle(ItemData.casingName.split("_").join(" ").split("patron"))
                            .setThumbnail(ImageThumbnail)
                            .setDescription('ITEM DESCRIPTION')
                            .addFields({ name: 'Damage: ', value: `${ItemData.Damage}` }, { name: 'Penetration:', value: `${ItemData.PenetrationPower}` }, { name: 'Armor Damage:', value: `${ItemData.ArmorDamage}` }, { name: 'Projectile Speed:', value: `${ItemData.InitialSpeed}` })
                        message.channel.send(newEmbed);
                    }
                }
            }
        } else {
            ErrorMessage('Please enter an item to search', message)
        }
    }
}