// Command Config
const CommandSettings = {
    CommandData: {
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
    },
    DMCommand: true
}

const { MessageEmbed } = require('discord.js')
const Settings = require('../settings.json')
const { QuestSearchEngine } = require('../command_modules/questsearchengine')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const ItemFromName = require('../game_data/api/itemfromname.json')
const { QuestInfo } = require('../classes/questinfo')

// Command Functions
const CommandFunction = (args) => {
    if (args['questname'].length < 3 || args['questname'].length > 100) {
        return ErrorMessage('Please keep the Quest input length between 3 and 100 characters')
    }

    let Quest = QuestSearchEngine(args['questname'].toLowerCase())

    let Length = Quest.length

    if (Length === 1) {
        let QuestStuff = new QuestInfo(Quest[0])
        return {
            Type: "ServerMessage",
            Content: new MessageEmbed()
                .setTitle(QuestStuff.QuestName)
                .setThumbnail(QuestStuff.QuestImage)
                .addFields({
                    name: 'Wiki Link',
                    value: `[Click Here](${QuestStuff.WikiLink})`,
                    inline: true
                }, {
                    name: 'Experience',
                    value: QuestStuff.Experience,
                    inline: true
                }, {
                    name: 'Unlocks',
                    value: GetUnlocks(QuestStuff.Unlocks),
                    inline: true
                }, {
                    name: 'Needed For Kappa',
                    value: 'true'
                })
        }
    } else if (Length > 1) {
        return {
            Type: "Error",
            Content: ErrorMessageField(`Quest search of \"${args['questname'].toLowerCase()}\" came back with multiple results, please be more specific`, {
                name: 'Results',
                value: Quest
            }),
            Time: 15000
        }
    }
}

const GetUnlocks = (array) => {
    let Unlocks = new Array()

    for (const i in array) {
        let Item = array[i]
        Unlocks.push(ItemFromName[Item].ShortName)
    }

    return Unlocks
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings