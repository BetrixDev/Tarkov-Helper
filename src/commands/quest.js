const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const Settings = require('../settings.json')
const { QuestSearchEngine } = require('../command_modules/questsearchengine')
const { ErrorMessage } = require('../command_modules/errormessage')
const ItemFromName = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromname.json'))
const { QuestInfo } = require('../classes/questinfo')

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

// Command Functions
const CommandFunction = (args, { interaction }) => {
    let Quest = QuestSearchEngine(args['questname'])

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
                    value: (QuestStuff.Unlocks.length > 0 ? QuestStuff.Unlocks : 'None'),
                    inline: true
                }, {
                    name: 'Needed For Kappa',
                    value: QuestStuff.Kappa
                })
        }
    } else if (Length > 1) {
        let uid = interaction.member.user.id
        let Array = require('../command_modules/search').CreateInput(Quest, 'quest', uid)

        return {
            Type: "Error",
            Content: new MessageEmbed()
                .setTitle('Error')
                .setColor(Settings.BotSettings.ErrorColor)
                .setDescription(`Item search of \"${args['questname'].toLowerCase()}\" came back with multiple results, please be more specific. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
                .addFields({ name: 'Results', value: Array })
        }

    } else {
        return {
            Type: "Error",
            Content: ErrorMessage('No Results found')
        }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings