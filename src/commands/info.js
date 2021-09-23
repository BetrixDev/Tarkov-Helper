require('../utils')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: {
        name: 'info',
        description: 'Returns basic info on how to use Tarkov Helper',
        options: []
    },
    message: (args, obj) => {
        let Updated = ReadJson('./src/bot_data/updated.json')

        return {
            Type: "ephemeral",
            Content: new MessageEmbed()
                .setTitle('Tarkov Helper Information')
                .setThumbnail(Settings.Images.Logo250)
                .setImage(Settings.Images.SlashBanner)
                .setDescription(`
                • A Discord bot to make accessing information within Escape From Tarkov easier.
                • Start a command by typing \`/\` in the message box and follow each command's guide
                • If you don't see anything make sure you have slash commands enabled by going to **User Settings > Text & Images**, and enable \"Use slash commands...\"
                • If you still don't see anything ask the server owner or admins if slash commands are enabled in that specific channel or DM Tarkov Helper to use the commands instead
    
                **Current server count: ${obj.serverCount}**`)
                .addFields(ResolveStrings([{
                    name: 'Official Wiki',
                    value: '[Click Here](https://github.com/BetrixDev/Tarkov-Helper/wiki)'
                }, {
                    name: 'Add Tarkov Helper to Your Sever',
                    value: '[Click Here](https://top.gg/bot/797600238449590334/invite/)'
                }, {
                    name: 'Visit Tarkov Helper on top.gg',
                    value: '[Click Here](https://top.gg/bot/797600238449590334)'
                }, {
                    name: 'Data Last Updated',
                    value: [
                        `Maps/Bosses as of patch: **${Updated.SPT}**`,
                        `Prices: **${Updated.Prices}**`,
                        `Items/Barters/Quests: **${Updated.Other}**`
                    ]
                }]))
        }
    }
}