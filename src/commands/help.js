const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'help',
            description: 'Returns basic info on how to use Tarkov Helper',
            options: []
        }
    },
    DMCommand: true
}

// Command Functions
const CommandFunction = (args, obj) => {
    let Updated = JSON.parse(require('fs').readFileSync('./src/bot_data/updated.json'))

    return {
        Type: "ServerMessage",
        Content: new MessageEmbed()
            .setTitle('Tarkov Helper Information')
            .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/Logo200x200.png')
            .setImage('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/SlashCommand.png')
            .setDescription(`
            • A Discord bot to make accessing information within Escape From Tarkov easier.
            • Start a command by typing \`/\` in the message box and follow each command's guide
            • If you don't see anything make sure you have slash commands enabled by going to **User Settings > Text & Images**, and enable \"Use slash commands...\"
            • If you still don't see anything ask the server owner or admins if slash commands are enabled in that specific channel or DM Tarkov Helper to use the commands instead

            **Current server count: ${obj.serverCount}**`)
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