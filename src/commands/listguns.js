require('../utils')
const ItemData = ReadJson('./src/game_data/api/itemdata.json')
const { CaliberSearchEngine, GetCalibers } = require('../command_modules/calibersearchengine')
const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'listguns',
            description: 'Returns all guns that fire the specified caliber',
            options: [{
                name: 'caliber',
                description: 'What caliber to get guns from',
                required: true,
                type: 3
            }]
        }
    },
    DMCommand: true
}

// Command Functions
const CommandFunction = (args, { interaction, uid }) => {
    let Caliber = args['caliber']

    let EngineResults = CaliberSearchEngine(Caliber)
    Caliber = EngineResults.Results[0]

    if (Caliber === undefined) {
        let Array = require('../command_modules/search').CreateInput(GetCalibers(), 'caliber', uid)
        return {
            Type: "Error",
            Content: new MessageEmbed()
                .setTitle('Error')
                .setThumbnail(Settings.Images.Thumbnails.Search)
                .setColor(Settings.BotSettings['Alt-Color'])
                .setDescription(`Caliber search of \"${args['caliber'].toLowerCase()}\" came back with multiple results, please be more specific. [Click here](${Settings.CaliberArrayLink}) to see a list of all possible entries. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
                .addFields({ name: 'Results', value: Array })
        }
    }

    let Guns = new Array()
    for (const ItemID in ItemData) {
        let Item = ItemData[ItemID]

        if (Item.Types.includes('gun') && Item.RawData !== undefined) {
            if (Item.RawData._props.ammoCaliber.includes(Caliber.replace('.', ''))) {
                Guns.push(`\`${Guns.length + 1}\` **-** ${Item.Name}`)
            }
        } else if (Item.Types.includes('gun') && Item.Name.includes(Caliber)) {
            Guns.push(`\`${Guns.length + 1}\` **-** ${Item.Name}`)
        }
    }

    return {
        Type: "ServerMessage",
        Content: new MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle(`Guns Chambered In: ${Caliber}`)
            .setThumbnail('https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/ui_icons/icon_ammo.png')
            .setDescription([`[Click here](${Settings.CaliberArrayLink}) to see a list of all possible entries.\n`, ...Guns])
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings