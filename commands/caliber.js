// Load moduels
const fs = require('fs')

// Load command_modules
const { CaliberSearchEngine } = require("../command_modules/calibersearchengine")
const { ErrorMessage } = require("../command_modules/errormessage")

// Load bot settings
const Settings = require("../settings.json")

// Load game data
const AmmoData = JSON.parse(fs.readFileSync('./game_data/ammo.json'))
const ItemData = JSON.parse(fs.readFileSync('./game_data/items.json'))
const ItemFromID = JSON.parse(fs.readFileSync('./game_data/itemfromid.json'))

module.exports = {
    name: 'caliber',
    description: "",
    execute(message, args, Discord) {

        let SearchResults = CaliberSearchEngine(args)

        if (SearchResults !== undefined) {
            if (SearchResults.length > 1) {

                ErrorMessage('The search result came back with multiple quests, please be more specific', message, [{ name: 'Results:', value: SearchResults }])

            } else if (SearchResults.length === 1) {

                let Caliber = SearchResults[0]
                let DataCaliber = "Caliber" + Caliber
                let CaliberData = new Array()

                for (const Patron in AmmoData) {

                    let Ammo = AmmoData[Patron]

                    if (Ammo._props.Caliber === DataCaliber) {

                        let UnformattedName = ItemData[ItemFromID[Ammo._id].Name].Name.split('mm').pop()
                        let FormattedName = UnformattedName.substring(1);
                        let AmmoEntry = [{ name: FormattedName, value: "\u200B", inline: true },
                            { name: Ammo._props.Damage, value: "\u200B", inline: true },
                            { name: Ammo._props.PenetrationPower, value: "\u200B", inline: true }
                        ]

                        CaliberData.push(AmmoEntry)

                    }
                }

                let MessageArray = [{ name: "Name", value: "\u200B", inline: true }, { name: "Damage", value: "\u200B", inline: true }, { name: "Penetration", value: "\u200B", inline: true }]
                for (const Ammo in CaliberData) {
                    MessageArray.push(CaliberData[Ammo])
                }

                SendMessage(MessageArray, Caliber, Discord, message)

            }
        }
    }
}

function SendMessage(Fields, Name, Discord, message) {
    const EmbededMessage = {
        color: Settings.BotSettings.Color,
        title: Name,
        fields: Fields,
        footer: {
            text: Settings.Text.Caliber.FooterText,
        },
    }
    message.channel.send({ embed: EmbededMessage })
}