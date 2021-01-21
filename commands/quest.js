const { QuestSearchEngine } = require("../command_modules/questsearchengine")
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
            if (SearchResults.length > 1) {
                console.log(SearchResults.length)
                if (SearchResults.length < 16) {
                    const NewMessage = new Discord.MessageEmbed()
                        .setColor(Settings.BotSettings.ErrorColor)
                        .setAuthor('Tarkov Helper', Settings.Images.Author)
                        .setTitle('Error!')
                        .setDescription('The search result came back with multiple quests, please be more specific')
                        .addFields({ name: 'Results:', value: SearchResults })
                        .setThumbnail(Settings.Images.Thumbnails.Error)
                    message.channel.send(NewMessage);
                }
            } else if (SearchResults.length === 1) {
                let Quest = SearchResults[0]
                let QuestID = QuestNames[Quest].ID
                let QuestData = Quests[QuestID]
                let QuestLocation = "Any"
                let QuestDescription = Mail[Quests[QuestID].description]
                let WikiLink = `https://escapefromtarkov.gamepedia.com/${QuestData.name.replace(' ', '_')}`
                console.log(WikiLink)
                if (QuestData.location === "any") {
                    QuestLocation = "Any"
                } else {
                    QuestLocation = Locations[QuestData.location].Name
                }
                let FieldConditions = new Array()
                for (const Condition in QuestData.conditions) {
                    if (QuestData.conditions[Condition] !== '') {
                        FieldConditions.push(QuestData.conditions[Condition])
                    }
                }
                let QuestJsonPos = null
                for (const QuestPos in QuestJsonData) { if (QuestJsonData[QuestPos]._id === QuestID) { QuestJsonPos = QuestPos } }
                let QuestData2 = QuestJsonData[QuestJsonPos]
                let QuestImageID = QuestData2.image.replace('/files/quest/icon/', '')
                let ImageThumbnail = 'https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/QuestionLogo128x128.png'
                if (await urlExist(`https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${QuestImageID}`)) {
                    ImageThumbnail = `https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/game_data/images/${QuestImageID}`
                }
                SendMessage([
                    { name: "Location", value: QuestLocation, inline: true },
                    { name: "Conditions", value: FieldConditions }
                ], QuestData.name, `${QuestDescription}\n[Wiki Link To Quest](https://escapefromtarkov.gamepedia.com/${QuestData.name.replace(' ', '_')})`, ImageThumbnail, Discord, message)
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
            text: Settings.Text.Stats.FooterText,
        },
    }
    message.channel.send({ embed: EmbededMessage })
}