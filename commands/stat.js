const { ErrorMessage } = require('../command_modules/errormessage');
const Settings = require('../settings.json')
var ItemNames = require('../game_data/itemnames.json')
var Items = require('../game_data/items.json');
const urlExist = require('url-exist');
var Templates = require('../game_data/text/templates.json')
var MaterialDestructibility = require('../game_data/materialdestructibility.json');
const { SearchEngine } = require('../command_modules/searchengine');

module.exports = {
    name: 'stat',
    description: "Returns the stats of the item specified",
    async execute(message, args, Discord) {
        let EngineResult = SearchEngine(args)
        let SearchItem = EngineResult[0]
        let SearchResults = EngineResult[1]
        let ItemResults = EngineResult[2]
        if (SearchItem !== undefined && SearchItem.length > 2) {
            if (SearchResults.length > 1) {
                if (SearchResults.length < 16) {
                    const NewMessage = new Discord.MessageEmbed()
                        .setColor(Settings.BotSettings.ErrorColor)
                        .setAuthor('Tarkov Helper', Settings.Images.Author)
                        .setTitle('Error!')
                        .setDescription('The search result came back with multiple items, please be more specific')
                        .addFields({ name: 'Results:', value: SearchResults })
                        .setThumbnail(Settings.Images.Thumbnails.Error)
                    message.channel.send(NewMessage);
                } else {
                    ErrorMessage(`Search came back with ${SearchResults.length} results, please more specific`, message)
                }
            } else if (SearchResults.length === 1) {
                let Item = ItemResults[0]
                let ItemID = ItemNames[Item].ID
                let ItemFullName = Items[ItemID]._name
                let ItemData = Items[ItemID]._props
                let ItemDescription = Templates[ItemID].Description
                let ImageThumbnail = 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/QuestionLogo128x128.png'
                if (await urlExist(`https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemFullName}.png`)) {
                    ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemFullName}.png`
                } else if (await urlExist(`https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemID}.png`)) {
                    ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${ItemID}.png`
                }
                let WikiLink = `https://escapefromtarkov.gamepedia.com/${Templates[ItemID].Name.replace('. ', '_-_').replace(' ', '_').split(' ').join('_')}`
                console.log(WikiLink)
                if (ItemFullName.includes('patron_') === true) {
                    SendMessage([
                        { name: "Damage", value: ItemData.Damage },
                        { name: "Penetration", value: ItemData.PenetrationPower },
                        { name: "Armor Damage", value: ItemData.ArmorDamage },
                        { name: "Bullet Velocity", value: `${ItemData.InitialSpeed}m/s` },
                        { name: "Fragmentation Chance", value: parseFloat(ItemData.FragmentationChance * 100).toFixed(2) + "%" }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('foregrip_') === true || ItemFullName.includes('silencer_') === true || ItemFullName.includes('handguard_') === true || ItemFullName.includes('stock_') === true || ItemFullName.includes('scope_') === true) {
                    SendMessage([
                        { name: "Recoil", value: ItemData.Recoil },
                        { name: "Ergonomics", value: ItemData.Ergonomics },
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('weapon_') === true && ItemData.ItemSound.includes('knife') === false) {
                    SendMessage([
                        { name: "Vertical Recoil", value: ItemData.RecoilForceUp },
                        { name: "Horizontal Recoil", value: ItemData.RecoilForceBack },
                        { name: "Firerate", value: `${ItemData.bFirerate}RPM` },
                        { name: "Ergonomics", value: ItemData.Ergonomics }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('rig_') === true || ItemFullName.includes('rig') === true) {
                    let ContainerSize = 0
                    for (Grid in ItemData.Grids) {
                        let GridSize = ItemData.Grids[Grid]._props.cellsH * ItemData.Grids[Grid]._props.cellsV
                        ContainerSize = ContainerSize + GridSize
                    }
                    let Size = ItemData.Width * ItemData.Height
                    let SpaceEfficiency = Math.round(10 * (ContainerSize / Size)) / 10
                    let MessageArray = new Array()
                    if (ItemData.armorClass === NaN) {
                        MessageArray = [
                            { name: "Size", value: Size },
                            { name: "Container", value: ContainerSize },
                            { name: "Space Efficiency", value: SpaceEfficiency }
                        ]
                    } else {
                        MessageArray = [
                            { name: "Size", value: Size, inline: true },
                            { name: "Container", value: ContainerSize, inline: true },
                            { name: "Space Efficiency", value: SpaceEfficiency, inline: true },
                            { name: "Armor Level", value: ItemData.armorClass, inline: true },
                            { name: "Durability", value: ItemData.MaxDurability, inline: true },
                            { name: "Effective Durability", value: Math.floor(ItemData.MaxDurability / MaterialDestructibility[ItemData.ArmorMaterial]), inline: true },
                            { name: "Speed Penalty", value: `${ItemData.speedPenaltyPercent}%`, inline: true },
                            { name: "Mouse Penalty", value: `${ItemData.mousePenalty}%`, inline: true },
                            { name: "Ergonomic Penalty", value: ItemData.weaponErgonomicPenalty, inline: true },
                            { name: "Armor Areas", value: ItemData.armorZone, inline: true },
                            { name: "Material", value: ItemData.ArmorMaterial, inline: true },
                            { name: "Weight", value: `${ItemData.Weight}kg`, inline: true }
                        ]
                    }
                    SendMessage(MessageArray, Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('helmet_') === true) {
                    SendMessage([
                        { name: "Armor Level", value: ItemData.armorClass, inline: true },
                        { name: "Durability", value: ItemData.MaxDurability, inline: true },
                        { name: "Effective Durability", value: Math.floor(ItemData.MaxDurability / MaterialDestructibility[ItemData.ArmorMaterial]), inline: true },
                        { name: "Speed Penalty", value: `${ItemData.speedPenaltyPercent}%`, inline: true },
                        { name: "Mouse Penalty", value: `${ItemData.mousePenalty}%`, inline: true },
                        { name: "Ergonomic Penalty", value: ItemData.weaponErgonomicPenalty, inline: true },
                        { name: "Armor Areas", value: ItemData.headSegments, inline: true },
                        { name: "Material", value: ItemData.ArmorMaterial, inline: true },
                        { name: "Weight", value: `${ItemData.Weight}kg`, inline: true }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('armor_') === true) {
                    SendMessage([
                        { name: "Armor Level", value: ItemData.armorClass, inline: true },
                        { name: "Durability", value: ItemData.MaxDurability, inline: true },
                        { name: "Effective Durability", value: Math.floor(ItemData.MaxDurability / MaterialDestructibility[ItemData.ArmorMaterial]), inline: true },
                        { name: "Speed Penalty", value: `${ItemData.speedPenaltyPercent}%`, inline: true },
                        { name: "Mouse Penalty", value: `${ItemData.mousePenalty}%`, inline: true },
                        { name: "Ergonomic Penalty", value: ItemData.weaponErgonomicPenalty, inline: true },
                        { name: "Armor Areas", value: ItemData.armorZone, inline: true },
                        { name: "Material", value: ItemData.ArmorMaterial, inline: true },
                        { name: "Weight", value: `${ItemData.Weight}kg`, inline: true }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('container_') === true) {
                    let ContainerSize = 0
                    for (Grid in ItemData.Grids) {
                        let GridSize = ItemData.Grids[Grid]._props.cellsH * ItemData.Grids[Grid]._props.cellsV
                        ContainerSize = ContainerSize + GridSize
                    }
                    let Size = ItemData.Width * ItemData.Height
                    let SpaceEfficiency = Math.round(10 * (ContainerSize / Size)) / 10
                    SendMessage([
                        { name: "Size", value: Size, inline: true },
                        { name: "Container", value: ContainerSize, inline: true },
                        { name: "Space Efficiency", value: SpaceEfficiency, inline: true },
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('weapon_') === true && ItemData.ItemSound.includes('knife') === false) {
                    SendMessage([
                        { name: "Stab Damage Slash/Stab", value: `${ItemData.knifeHitSlashDam}/${ItemData.knifeHitStabDam}`, inline: true }
                    ], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else {
                    SendMessage([], Templates[ItemID].Name, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                }
            }
        } else {
            ErrorMessage('Please enter an item to search', message)
        }
    }
}

function SendMessage(Fields, Name, Description, Thumbnail, Discord, message, WikiLink) {
    const EmbededMessage = {
        color: Settings.BotSettings.Color,
        title: Name,
        description: `${Description}\n[Wiki Link To Item](${WikiLink})`,
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