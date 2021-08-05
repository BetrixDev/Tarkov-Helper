require('../utils')
const { MessageEmbed } = require('discord.js')
const { QuestSearchEngine } = require('../command_modules/questsearchengine')
const { QuestInfo } = require('../classes/questinfo')

module.exports = {
    data: {
        name: 'quest',
        description: 'Retrieve basic information about a quest as well as a link to the wiki',
        options: [{
            name: 'questname',
            description: 'Name of the quest',
            required: true,
            type: 3
        }]
    },
    message: (args, { uid }) => {
        let Quest = QuestSearchEngine(args['questname'])

        let Length = Quest.length

        if (Length === 1) {

            let QuestStuff = new QuestInfo(Quest[0])
            if (QuestStuff.QuestName.includes('Gunsmith')) {
                return {
                    Type: "serverMessage",
                    Content: new MessageEmbed()
                        .setColor(Settings.BotSettings.Color)
                        .setTitle(QuestStuff.QuestName)
                        .setThumbnail(QuestStuff.QuestImage)
                        .addFields(ResolveStrings([{
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
                            name: 'Shopping List',
                            value: QuestStuff.Gunsmith().ShoppingList,
                            inline: true
                        }, {
                            name: 'Total Cost For Parts',
                            value: QuestStuff.Gunsmith().Price,
                            inline: true
                        }]))
                }
            } else {
                return {
                    Type: "serverMessage",
                    Content: new MessageEmbed()
                        .setColor(Settings.BotSettings.Color)
                        .setTitle(QuestStuff.QuestName)
                        .setThumbnail(QuestStuff.QuestImage)
                        .addFields(ResolveStrings([{
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
                        }]))
                }
            }
        } else if (Length > 1) {
            let Array = require('../command_modules/search').CreateInput(Quest, 'quest', uid)

            return {
                Type: "error",
                Content: new MessageEmbed()
                    .setTitle('Error')
                    .setThumbnail(Settings.Images.Thumbnails.Search)
                    .setColor(Settings.BotSettings['Alt-Color'])
                    .setDescription(`Item search of \"${args['questname'].toLowerCase()}\" came back with multiple results, please be more specific. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
                    .addFields(ResolveStrings([{ name: 'Results', value: Array }]))
            }

        } else {
            return {
                Type: "error",
                Content: ErrorMessage('No Results found')
            }
        }
    }
}