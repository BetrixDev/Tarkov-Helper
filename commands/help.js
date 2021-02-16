//load data
const Responses = require("../settings.json")

module.exports = {
    name: 'help',
    description: "Get help with how to use commands. Sytax: !COMMAND {CUSTOM USER INPUT FIELD}",
    execute(message, args, Discord) {

        const EmbededMessage = {
            color: Responses.BotSettings.Color,
            Title: "Tarkov Helper helper center",
            description: "View this project on [Github](https://github.com/BetrixEdits/Tarkov-Helper)",
            thumbnail: {
                url: "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/QuestionLogo128x128.png"
            },
            fields: [
                { name: "Default Prefix", value: "!th" },
                { name: "Commands", value: "General Commands: \n\`Stat {ITEM}\` \n\`Bitcoinfarm {GPUS}\` \n\`Bitcoinfarm Compare {GPUS} {GPUS2}\` \n\`Caliber {CALIBER}\` \n\`Map {MAP} {SPECIFIC MAP}\` \n\`Quest {QUEST}\` \n\`Xpto {END LEVEL} {CURRENT LEVEL / CURRENT EXP}\` \n\n PM Only Commands: \n\`Notify {TRADER}\` \n\n Admin Commands: \n\`Prefixset {PREFIX}\`" }
            ]
        }

        message.channel.send({ embed: EmbededMessage })
    }
}