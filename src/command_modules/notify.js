require('../utils')
const fs = require('fs')
let ItemFromID = ReadJson('./src/game_data/api/itemfromid.json')
const { MessageEmbed } = require('discord.js')
let { DMUser } = require('../bot')

async function GenerateNotifications() {
    let notifyList = ReadJson('./src/bot_data/notifylist.json')
    let priceData = ReadJson('./src/game_data/api/pricedata.json')

    for (let uid in notifyList) {
        let userNotifications = notifyList[uid]

        for (let i in userNotifications) {
            let notification = userNotifications[i]

            let itemPrice = priceData[notification.id].Item.lastLowPrice

            if (itemPrice < notification.max) {
                try {
                    await DMUser(uid, new MessageEmbed()
                        .setColor(Settings.BotSettings['Alt-Color'])
                        .setThumbnail(Settings.Images.Thumbnails.PriceNotify)
                        .setTitle(`Price Notification for ${ItemFromID[notification.id].ShortName}`)
                        .setDescription(`
                        **${ItemFromID[notification.id].Name}** is currently under ${FormatPrice(notification.max)} at ${FormatPrice(itemPrice)}
                        
                        *The notification for this item has now been removed, to add it back use this command:*
                        \`/pricenotify item:${notification.id} maximum:${notification.max}\`
                        `)
                    )

                    notifyList[uid].splice(i, 1)
                } catch (e) {
                    console.log(e)
                }

                delete notification
            }
        }
    }

    fs.writeFileSync('./src/bot_data/notifylist.json', JSON.stringify(notifyList, null, 4))
}

exports.GenerateNotifications = GenerateNotifications