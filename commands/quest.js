// Load modules
const fs = require('fs')

// load command_modules
const { QuestSearchEngine } = require("../command_modules/questsearchengine")
const { ErrorMessage } = require('../command_modules/errormessage')

// Load bot data
var Settings = require('../settings.json')

// Load quest data
const QuestJsonData = JSON.parse(fs.readFileSync('./game_data/quests.json'))

module.exports = {
    name: 'quest',
    description: "",
    async execute(message, args, Discord) {
        let EngineResult = QuestSearchEngine(args)
        let SearchItem = EngineResult[0]
        let SearchResults = EngineResult[1]

        if (SearchItem !== undefined && SearchItem.length > 2) {
            if (SearchResults.length > 1 && SearchResults.length < 16) {

                ErrorMessage('The search result came back with multiple quests, please be more specific', message, [{ name: 'Results:', value: SearchResults }])

            } else if (SearchResults.length === 1) {

                let Quest = SearchResults[0]

                // Get Quest Data
                let QuestData = QuestJsonData[Quest]
                let QuestLocation = QuestData.Location
                let FieldConditions = QuestData.Conditions
                let ImageThumbnail = QuestData.ImageLink

                // Send message function
                SendMessage([
                    { name: "Location", value: QuestLocation, inline: true },
                    { name: "Conditions", value: FieldConditions }
                ], QuestData.name, `[Wiki Link To Quest](${QuestData.WikiLink})`, ImageThumbnail, Discord, message)

            }
        }
    }
}

function SendMessage(Fields, Name, Description, Thumbnail, Discord, message) {
    const EmbededMessage = {
        color: Settings.BotSettings.Color,
        title: Name,
        description: Description,
        thumbnail: {
            url: Thumbnail,
        },
        fields: Fields,
        footer: {
            text: Settings.Text.Quest.FooterText,
        },
    }
    message.channel.send({ embed: EmbededMessage })
}