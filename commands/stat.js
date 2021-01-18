const { ErrorMessage } = require('../command_modules/errormessage');
const Settings = require('../settings.json')
var ItemNames = require('../game_data/itemnames.json')
var Items = require('../game_data/items.json');
const urlExist = require('url-exist');
var Templates = require('../game_data/text/templates.json')

module.exports = {
    name: 'stat',
    description: "Returns the stats of the item specified",
    async execute(message, args, Discord) {
        let SearchItem = ""
        for (let Arg in args) {
            SearchItem = SearchItem + " " + args[Arg]
        }
        if (SearchItem !== undefined && SearchItem.length > 2) {
            let SearchResults = new Array()
            let ItemResults = new Array()
            for (const Item in ItemNames) {
                if (Item.toLowerCase().includes(SearchItem.toLowerCase())) {
                    SearchResults.push(Item.toLowerCase())
                    ItemResults.push(Item)
                }
            }
            if (SearchResults.length > 1) {
                const NewMessage = new Discord.MessageEmbed()
                    .setColor(Settings.BotSettings.ErrorColor)
                    .setAuthor('Tarkov Helper', Settings.Images.Author)
                    .setTitle('Error!')
                    .setDescription('The search result came back with multiple items, please be more specific')
                    .addFields({ name: 'Results:', value: SearchResults })
                    .setThumbnail(Settings.Images.Thumbnails.Error)
                message.channel.send(NewMessage);
            } else if (SearchResults.length === 1) {
                let Item = ItemResults[0]
                let ItemID = ItemNames[Item].ID
                let ItemFullName = Items[ItemID]._name
                let ItemData = Items[ItemID]._props
                let ItemDescription = Templates[ItemID].Description
                let ImageThumbnail = ``
                if (await urlExist(`https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemFullName}.png`)) {
                    ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemFullName}.png`
                } else if (await urlExist(`https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemID}.png`)) {
                    ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemID}.png`
                } else {
                    ImageThumbnail = 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/QuestionLogo128x128.png'
                }
                if (ItemFullName.includes('patron_') === true) {
                    AmmoMessage(ItemData.Damage, ItemData.PenetrationPower, ItemData.ArmorDamage, ItemData.InitialSpeed, Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message)
                } else if (ItemFullName.includes('foregrip_') === true || ItemFullName.includes('silencer_') === true || ItemFullName.includes('handguard_') === true || ItemFullName.includes('stock_') === true) {
                    AttachmentMessage(ItemData.Recoil, ItemData.Ergonomics, Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message)
                }
            }
        } else {
            ErrorMessage('Please enter an item to search', message)
        }
    }
}

function AmmoMessage(Damage, Penetration, ArmorDamage, BulletSpeed, Name, Description, Thumbnail, Discord, message) {
    const newEmbed = new Discord.MessageEmbed()
        .setColor('#cecdc3')
        .setAuthor('Tarkov Helper', Settings.Images.Author)
        .setTitle(Name)
        .setThumbnail(Thumbnail)
        .setDescription(Description)
        .addFields({ name: 'Damage: ', value: `${Damage}` }, { name: 'Penetration:', value: `${Penetration}` }, { name: 'Armor Damage:', value: `${ArmorDamage}` }, { name: 'Projectile Speed:', value: `${BulletSpeed}m/s` })
        .setFooter(Settings.Text.Stats.FooterText)
    message.channel.send(newEmbed);
}

function AttachmentMessage(Recoil, Ergonomics, Name, Description, Thumbnail, Discord, message) {
    const newEmbed = new Discord.MessageEmbed()
        .setColor('#cecdc3')
        .setAuthor('Tarkov Helper', Settings.Images.Author)
        .setTitle(Name)
        .setThumbnail(Thumbnail)
        .setDescription(Description)
        .addFields({ name: 'Recoil Reduction: ', value: `${Recoil}%` }, { name: 'Ergonomics:', value: `${Ergonomics}` })
        .setFooter(Settings.Text.Stats.FooterText)
    message.channel.send(newEmbed);
}