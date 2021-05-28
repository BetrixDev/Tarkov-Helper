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
                type: 3,
                choices: [
                    { name: '5.56x45', value: '5.56x45' },
                    { name: '12x70', value: '12x70' },
                    { name: '7.62x54R', value: '7.62x54R' },
                    { name: '7.62x39', value: '7.62x39' },
                    { name: '9x19', value: '9x19' },
                    { name: '5.45x39', value: '5.45x39' },
                    { name: '7.62x25', value: '7.62x25' },
                    { name: '9x18', value: '9x18' },
                    { name: '9x39', value: '9x39' },
                    { name: '7.62x51', value: '7.62x51' },
                    { name: '.366', value: '.366' },
                    { name: '9x21', value: '9x21' },
                    { name: '20x70', value: '20x70' },
                    { name: '4.6x30', value: '4.6x30' },
                    { name: '12.7x55', value: '12.7x55' },
                    { name: '5.7x28', value: '5.7x28' },
                    { name: '12/70', value: '12/70' },
                    { name: '20/70', value: '20/70' },
                    { name: '30x29', value: '30x29' },
                    { name: '.45', value: '.45' },
                    { name: '23x75', value: '23x75' },
                    { name: '40x46', value: '40x46' },
                    { name: '.300', value: '.300' },
                    { name: '.338', value: '.338' }
                ]
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