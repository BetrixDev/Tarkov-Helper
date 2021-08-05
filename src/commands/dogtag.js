require('../utils')
let MaxLevel = ReadJson('./src/game_data/database/globals.json').config.exp.level.exp_table.length
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: {
        name: 'dogtag',
        description: 'Gets the price of a dogtag',
        options: [{
            name: 'level',
            description: 'Level of the dogtag',
            required: true,
            type: 3
        }]
    },
    message: (args) => {
        let Level = args['level']

        if (Level > MaxLevel || Level < 1) {
            return {
                Type: "error",
                Content: ErrorMessage('Please enter a valid level between 1 and ' + MaxLevel)
            }
        } else {
            return {
                Type: "serverMessage",
                Content: new MessageEmbed()
                    .setColor(Settings.BotSettings.Color)
                    .setTitle('Dogtag Price')
                    .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/item_icons/59f32c3b86f77472a31742f0.png`)
                    .addFields(ResolveStrings([{
                        name: 'Level Of Dogtag',
                        value: Level
                    }, {
                        name: 'Price Of Dogtag',
                        value: FormatPrice(Level * 378)
                    }]))
            }
        }
    }
}