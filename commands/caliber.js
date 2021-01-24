const { CaliberSearchEngine } = require("../command_modules/calibersearchengine")
const { ErrorMessage } = require("../command_modules/errormessage")
const AmmoData = require("../game_data/ammo.json")
const NameData = require("../game_data/text/templates.json")
const Settings = require("../settings.json")

module.exports = {
    name: 'caliber',
    description: "",
    execute(message, args, Discord) {
        if (args[0].toLowerCase() === "a" || args[0].toLowerCase() === "advanced") { // Advanced Mode
            if (message.guild === undefined) { // Message is a DM

            } else {

            }
        } else if (message.guild !== undefined) {
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
                            let UnformattedName = NameData[Ammo._id].Name.split('mm').pop()
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
                    console.log(MessageArray)
                }
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