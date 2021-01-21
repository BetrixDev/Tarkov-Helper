const { QuestSearchEngine } = require("../command_modules/questsearchengine")
const { ErrorMessage } = require('../command_modules/errormessage')
const urlExist = require('url-exist');
var Settings = require('../settings.json')
var Quests = require('../game_data/quest.json')
var QuestNames = require('../game_data/questnames.json')
var Locations = require('../game_data/locations.json')
var Mail = require('../game_data/text/mail.json')
var QuestJsonData = require('../game_data/quests.json')

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
                let QuestData = Quests[QuestNames[Quest].ID]

                let QuestLocation = GetQuestLocation(QuestData)
                let FieldConditions = GetConditions(QuestData)

                let QuestJsonPos = null
                for (const QuestPos in QuestJsonData) { if (QuestJsonData[QuestPos]._id === QuestNames[Quest].ID) { QuestJsonPos = QuestPos } }
                let QuestData2 = QuestJsonData[QuestJsonPos]
                let QuestImageID = QuestData2.image.replace('/files/quest/icon/', '')
                let ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${QuestImageID}`
                SendMessage([
                    { name: "Location", value: QuestLocation, inline: true },
                    { name: "Conditions", value: FieldConditions }
                ], QuestData.name, `[Wiki Link To Quest](https://escapefromtarkov.gamepedia.com/${QuestData.name.replace('. ', '_-_').replace(' ', '_').split(' ').join('_')})`, ImageThumbnail, Discord, message)
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

function GetQuestLocation(QuestData) {
    let QuestLocation = "Any"
    if (QuestData.location === "any") {
        QuestLocation = "Any"
    } else {
        QuestLocation = Locations[QuestData.location].Name
    }
    return QuestLocation
}

function GetConditions(QuestData) {
    let FieldConditions = new Array()
    for (const Condition in QuestData.conditions) {
        if (QuestData.conditions[Condition] !== '') {
            FieldConditions.push(QuestData.conditions[Condition])
        }
    }
    return FieldConditions
}