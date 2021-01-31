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

                    if (Ammo._props.Caliber === DataCaliber && Ammo._props.ItemSound.includes('generic') === false) {

                        // Add data to arrays
                        Names.push(ItemFromID[Ammo._id].Name)
                        Damages.push(Ammo._props.Damage)
                        Penetrations.push(Ammo._props.PenetrationPower)

                    }
                }

                // Sorting
                let NonSortedArray = new Array()

                for (const Ammo in Names) {
                    NonSortedArray.push({ Name: Names[Ammo], Damage: Damages[Ammo], Penetration: Penetrations[Ammo] })
                }

                let SortedValues = SortValues(NonSortedArray, 1)

                // Convert all values in arrays to one string with line breaks
                let NameString = `${SortedValues[0].join('\n')}`
                let DamageString = `${SortedValues[1].join('\n')}`
                let PenetrationString = `${SortedValues[2].join('\n')}`

                // Send message function
                SendMessage([{ name: 'Name:', value: NameString, inline: true },
                    { name: 'Damage:', value: DamageString, inline: true },
                    { name: 'Penetration:', value: PenetrationString, inline: true }
                ], Caliber, message)

            }
        }
    }
}

function SendMessage(Fields, Name, message) {
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

function SortValues(Values, Type) {

    const Types = ['Damage', 'Penetration']
    let InputArray = Values

    InputArray.sort(function(a, b) {
        return b[Types[Type]] - a[Types[Type]]
    })

    let OutputNames = new Array()
    let OutputDamages = new Array()
    let OutputPenetrations = new Array()

    for (const Ammo in InputArray) {

        OutputNames.push(InputArray[Ammo].Name)
        OutputDamages.push(InputArray[Ammo].Damage)
        OutputPenetrations.push(InputArray[Ammo].Penetration)

    }

    return [OutputNames, OutputDamages, OutputPenetrations]

}