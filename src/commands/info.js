const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'info',
            description: 'Returns basic info on how to use Tarkov Helper',
            options: []
        }
    },
    DMCommand: true
}

// Command Functions
const CommandFunction = () => {
    let Updated = JSON.parse(require('fs').readFileSync('./src/bot_data/updated.json'))
    console.log(Updated);
    return {
        Type: "ServerMessage",
        Content: new MessageEmbed()
            .setTitle('Tarkov Helper Information')
            .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo200x200.png')
            .setDescription('A Discord bot to make accessing information within Escape From Tarkov easier.')
            .addFields({
                name: 'Official Wiki',
                value: '[Click Here](https://github.com/BetrixEdits/Tarkov-Helper/wiki)'
            }, {
                name: 'Add Tarkov Helper to Your Sever',
                value: 'LINK SOON'
            }, {
                name: 'Data Last Updated',
                value: [
                    `Maps/Bosses as of patch: **${Updated.SPT}**`,
                    `Prices: **${Updated.Prices}**`,
                    `Items/Barters/Quests: **${Updated.Other}**`
                ]
            })
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings