// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'caliber',
            description: 'Returns basic info on how to use Tarkov Helper',
            options: [{
                name: 'caliber',
                description: 'What caliber to list information of',
                required: true,
                type: 3
            }]
        }
    },
    DMCommand: true
}

const { CaliberSearchEngine } = require('../command_modules/calibersearchengine')
const { MessageEmbed } = require('discord.js')

// Command Functions
const CommandFunction = (args) => {
    let Caliber = args['caliber']

    let EngineResults = CaliberSearchEngine(Caliber)
    Caliber = EngineResults.Results[0]

    let CaliberData = EngineResults.CaliberData[Caliber]

    let NonSortedArray = new Array()

    for (const Ammo of CaliberData) {
        NonSortedArray.push({ Name: Ammo.Name, Damage: Ammo.Damage, Penetration: Ammo.Penetration })
    }

    let SortedValues = SortValues(NonSortedArray, 1)

    let NameString = `${SortedValues[0].join('\n')}`
    let DamageString = `${SortedValues[1].join('\n')}`
    let PenetrationString = `${SortedValues[2].join('\n')}`

    let Message = new MessageEmbed()
        .setTitle(`${Caliber} Data`)
        .setThumbnail('https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/ui_icons/icon_ammo.png')
        .setDescription('For a list of all possible calibers [Click Here](https://gist.github.com/BetrixEdits/16c20db88feb4aefd22dbac6e257e290)')
        .addFields({
            name: 'Name',
            value: NameString,
            inline: true
        }, {
            name: 'Damage',
            value: DamageString,
            inline: true
        }, {
            name: 'Penetration',
            value: PenetrationString,
            inline: true
        })

    return { Type: "ServerMessage", Content: Message }
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

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings