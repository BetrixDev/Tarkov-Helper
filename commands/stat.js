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
        let SearchItemArray = SearchItem.split(" ")
        SearchItemArray.shift()
        SearchItem = SearchItemArray.join(" ")
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
                    SendMessage([
                        { name: "Damage", value: ItemData.Damage },
                        { name: "Penetration", value: ItemData.PenetrationPower },
                        { name: "Armor Damage", value: ItemData.ArmorDamage },
                        { name: "Bullet Velocity", value: `${ItemData.InitialSpeed}m/s` }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message)
                } else if (ItemFullName.includes('foregrip_') === true || ItemFullName.includes('silencer_') === true || ItemFullName.includes('handguard_') === true || ItemFullName.includes('stock_') === true) {
                    SendMessage([
                        { name: "Recoil", value: ItemData.Recoil },
                        { name: "Ergonomics", value: ItemData.Ergonomics },
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message)
                } else if (ItemFullName.includes('weapon_') === true) {
                    SendMessage([
                        { name: "Vertical Recoil", value: ItemData.RecoilForceUp },
                        { name: "Horizontal Recoil", value: ItemData.RecoilForceBack },
                        { name: "Firerate", value: `${ItemData.bFirerate}RPM` },
                        { name: "Ergonomics", value: ItemData.Ergonomics }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message)
                } else if (ItemFullName.includes('item_equipment_rig_') === true || ItemFullName.includes('rig') === true) {
                    let ContainerSize = 0
                    for (Grid in ItemData.Grids) {
                        let GridSize = ItemData.Grids[Grid]._props.cellsH * ItemData.Grids[Grid]._props.cellsV
                        ContainerSize = ContainerSize + GridSize
                    }
                    let Size = ItemData.Width * ItemData.Height
                    let SpaceEfficiency = Math.round(10 * (ContainerSize / Size)) / 10
                    SendMessage([
                        { name: "Size", value: Size },
                        { name: "Container", value: ContainerSize },
                        { name: "Space Efficiency", value: SpaceEfficiency }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message)
                } else {
                    SendMessage([], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message)
                }
            }
        } else {
            ErrorMessage('Please enter an item to search', message)
        }
    }
}

function SendMessage(Fields, Name, Description, Thumbnail, Discord, message) {
    const EmbededMessage = {
        color: Settings.BotSettings.Color,
        title: Name,
        description: Description,
        thumbnail: {
            url: Thumbnail,
        },
        fields: Fields,
        footer: {
            text: Settings.Text.Stats.FooterText,
        },
    }
    message.channel.send({ embed: EmbededMessage })
}