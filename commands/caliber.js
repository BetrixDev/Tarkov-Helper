// Load moduels
const fs = require('fs')

// Load command_modules
const { CaliberSearchEngine } = require("../command_modules/calibersearchengine")
const { ErrorMessage } = require("../command_modules/errormessage")

// Load bot settings
const Settings = require("../settings.json")

// Load game data
const AmmoData = JSON.parse(fs.readFileSync('./game_data/ammo.json'))
const ItemFromID = JSON.parse(fs.readFileSync('./game_data/itemfromid.json'))

module.exports = {
    name: 'caliber',
    description: "",
    execute(message, args, Discord) {

        // Get engine result
        let SearchResults = CaliberSearchEngine(args)

        if (SearchResults !== undefined) {
            if (SearchResults.length > 1) {

                ErrorMessage('The search result came back with multiple quests, please be more specific', message, [{ name: 'Results:', value: SearchResults }])

            } else if (SearchResults.length === 1) {

                let Caliber = SearchResults[0]
                let DataCaliber = "Caliber" + Caliber

                // Create arrays for message
                let Names = new Array()
                let Damages = new Array()
                let Penetrations = new Array()

                // Loop through all ammo in ammo.json
                for (const Patron in AmmoData) {

                    let Ammo = AmmoData[Patron]

                    if (Ammo._props.Caliber === DataCaliber) {

                        // Add data to arrays
                        Names.push(ItemFromID[Ammo._id].Name)
                        Damages.push(Ammo._props.Damage)
                        Penetrations.push(Ammo._props.PenetrationPower)

                    }
                }

                // Convert all values in arrays to one string with line breaks
                let NameString = `${Names.join('\n')}`
                let DamageString = `${Damages.join('\n')}`
                let PenetrationString = `${Penetrations.join('\n')}`

                // Send message function
                SendMessage([{ name: 'Name:', value: NameString, inline: true },
                    { name: 'Damage:', value: DamageString, inline: true },
                    { name: 'Penetration:', value: PenetrationString, inline: true }
                ], Caliber, Discord, message)

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