// Load modules
const Settings = require('../settings.json')
const fs = require('fs')

// Load game data
var MaterialDestructibility = require('../game_data/materialdestructibility.json')
const ItemJsonData = JSON.parse(fs.readFileSync('./game_data/items.json'))

// Load command_modules
const { ErrorMessage } = require('../command_modules/errormessage')
const { SearchEngine } = require('../command_modules/searchengine')

// Stat command
module.exports = {
    name: 'stat',
    description: "Returns the stats of the item specified",
    async execute(message, args, Discord) {

        // Get Search Result
        let EngineResult = SearchEngine(args)
        let SearchItem = EngineResult[0]
        let SearchResults = EngineResult[1]
        let ItemResults = EngineResult[2]

        if (SearchItem !== undefined && SearchItem.length > 2) { // If Search Result Came Back With More Than 1 Result
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
            } else if (SearchResults.length === 1) { // If Only One Search Result

                // Get Item Data
                let Item = ItemResults[0]
                let ItemID = ItemJsonData[Item].ID
                let ItemFullName = ItemJsonData[Item].Name
                let ItemData = ItemJsonData[Item].Data
                let ItemDescription = ItemJsonData[Item].Description
                let ImageThumbnail = ItemJsonData[Item].ImageLink
                let WikiLink = ItemJsonData[Item].WikiLink


                // Get and Send Item Specific Data
                if (ItemFullName.includes('patron_') === true) {
                    let MessageArray = [
                        { name: "Damage", value: ItemData.Damage },
                        { name: "Penetration", value: ItemData.Penetration },
                        { name: "Armor Damage", value: ItemData.ArmorDamage },
                        { name: "Bullet Velocity", value: `${ItemData.Velocity}m/s` },
                        { name: "Fragmentation Chance", value: parseFloat(ItemData.FragmentationChance * 100).toFixed(2) + "%" }
                    ]
                    if (ItemData.Pellets !== 0) {
                        MessageArray.push({ name: "Pellets", value: ItemData.Pellets })
                    }
                    SendMessage(MessageArray, Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('foregrip_') === true || ItemFullName.includes('silencer_') === true || ItemFullName.includes('handguard_') === true || ItemFullName.includes('stock_') === true || ItemFullName.includes('scope_') === true) {
                    SendMessage([
                        { name: "Recoil", value: ItemData.Recoil },
                        { name: "Ergonomics", value: ItemData.Ergonomics },
                    ], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('mag_') === true && ItemFullName.includes('stock_') === false) {
                    SendMessage([
                        { name: "Recoil", value: ItemData.Recoil },
                        { name: "Ergonomics", value: ItemData.Ergonomics },
                    ], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('weapon_') === true && ItemJsonData[Item].ItemSound.includes('weap') === true) {
                    SendMessage([
                        { name: "Vertical Recoil", value: ItemData.VeritcalRecoil, inline: true },
                        { name: "Horizontal Recoil", value: ItemData.HorizontalRecoil, inline: true },
                        { name: "Firerate", value: `${ItemData.Firerate}RPM`, inline: true },
                        { name: "Ergonomics", value: ItemData.Ergonomics, inline: true },
                        { name: "Fire Modes", value: ItemData.FireModes, inline: true },
                        { name: "Caliber", value: ItemData.Caliber, inline: true },
                    ], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('rig_') === true || ItemFullName.includes('rig') === true) {
                    let MessageArray = new Array()
                    if (ItemData.armorClass === NaN || ItemData.armorClass === undefined) {
                        MessageArray = [
                            { name: "Size", value: ItemData.Size },
                            { name: "Container", value: ItemData.ContainerSize },
                            { name: "Space Efficiency", value: ItemData.SpaceEfficiency }
                        ]
                    } else {
                        MessageArray = [
                            { name: "Size", value: ItemData.Size, inline: true },
                            { name: "Container", value: ItemData.ContainerSize, inline: true },
                            { name: "Space Efficiency", value: ItemData.SpaceEfficiency, inline: true },
                            { name: "Armor Level", value: ItemData.ArmorClass, inline: true },
                            { name: "Durability", value: ItemData.Durability, inline: true },
                            { name: "Effective Durability", value: Math.floor(ItemData.Durability / MaterialDestructibility[ItemData.Material]), inline: true },
                            { name: "Speed Penalty", value: `${ItemData.SpeedPenalty}%`, inline: true },
                            { name: "Mouse Penalty", value: `${ItemData.MousePenalty}%`, inline: true },
                            { name: "Ergonomic Penalty", value: ItemData.EgonomicPenalty, inline: true },
                            { name: "Armor Areas", value: ItemData.ArmorAreas, inline: true },
                            { name: "Material", value: ItemData.Material, inline: true },
                            { name: "Weight", value: `${ItemData.Weight}kg`, inline: true }
                        ]
                    }
                    SendMessage(MessageArray, Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('helmet_') === true) {
                    SendMessage([
                        { name: "Armor Level", value: ItemData.ArmorClass, inline: true },
                        { name: "Durability", value: ItemData.Durability, inline: true },
                        { name: "Effective Durability", value: Math.floor(ItemData.Durability / MaterialDestructibility[ItemData.Material]), inline: true },
                        { name: "Speed Penalty", value: `${ItemData.SpeedPenalty}%`, inline: true },
                        { name: "Mouse Penalty", value: `${ItemData.MousePenalty}%`, inline: true },
                        { name: "Ergonomic Penalty", value: ItemData.EgonomicPenalty, inline: true },
                        { name: "Armor Areas", value: ItemData.ArmorAreas, inline: true },
                        { name: "Material", value: ItemData.Material, inline: true },
                        { name: "Weight", value: `${ItemData.Weight}kg`, inline: true }
                    ], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('armor_') === true) {
                    SendMessage([
                        { name: "Armor Level", value: ItemData.ArmorClass, inline: true },
                        { name: "Durability", value: ItemData.Durability, inline: true },
                        { name: "Effective Durability", value: Math.floor(ItemData.Durability / MaterialDestructibility[ItemData.Material]), inline: true },
                        { name: "Speed Penalty", value: `${ItemData.SpeedPenalty}%`, inline: true },
                        { name: "Mouse Penalty", value: `${ItemData.MousePenalty}%`, inline: true },
                        { name: "Ergonomic Penalty", value: ItemData.EgonomicPenalty, inline: true },
                        { name: "Armor Areas", value: ItemData.ArmorAreas, inline: true },
                        { name: "Material", value: ItemData.Material, inline: true },
                        { name: "Weight", value: `${ItemData.Weight}kg`, inline: true }
                    ], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('container_') === true) {
                    SendMessage([
                        { name: "Size", value: ItemData.Size, inline: true },
                        { name: "Container", value: ItemData.ContainerSize, inline: true },
                        { name: "Space Efficiency", value: ItemData.SpaceEfficiency, inline: true },
                    ], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else if (ItemFullName.includes('weapon_') === true && ItemJsonData[Item].ItemSound.includes('knife') === true) {
                    SendMessage([
                        { name: "Stab Damage Slash/Stab", value: `${ItemData.SlashDamage}/${ItemData.StabDamage}`, inline: true }
                    ], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
                } else {
                    SendMessage([], Item, ItemDescription, ImageThumbnail, Discord, message, WikiLink)
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