// Command Config
const CommandSettings = {
    data: {
        name: 'quest',
        description: 'Retrieve basic information about a quest as well as a link to the wiki',
        options: [{
            name: 'questname',
            description: 'Name of the quest',
            required: true,
            type: 3
        }]
    }
}

const DiscordJS = require('discord.js')
const Settings = require('../settings.json')
const { QuestSearchEngine } = require('../command_modules/questsearchengine')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const { QuestInfo } = require('../classes/QuestInfo')
const QuestFromName = require('../game_data/quest-name.json')

// Command Functions
const CommandFunction = (args) => {
    if (args['questname'].length < 3 || args['questname'].length > 100) {
        return ErrorMessage('Please keep the Quest input between 3 and 100 characters')
    }

    let Quest = QuestSearchEngine(args['questname'].toLowerCase())

    let Length = Quest.length
    if (Length === 1) {
        let QuestStuff = new QuestInfo(QuestFromName[Quest].ID)
        return new DiscordJS.MessageEmbed()
            .setColor(Settings.BotSettings.Color)
            .setTitle(QuestStuff.QuestName)
            .setThumbnail(QuestStuff.QuestImage)
            .setDescription(QuestStuff.QuestDesc)
            .addFields({ name: 'Wiki Link', value: `[Click Here](${QuestStuff.WikiLink})` })
    } else if (Length > 1) {
        return ErrorMessageField(`Quest search of \"${args['questname'].toLowerCase()}\" came back with multiple results, please be more specific`, {
            name: 'Results',
            value: Quest
        })
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings