const QuestData = require('../game_data/quests.json')
const QuestImages = require('../game_data/questimages.json')

class QuestInfo {
    constructor(quest) {
        this.QuestName = quest
        this.QuestImage = `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/quest_icons/${QuestImages[quest].ImageID}.jpg`
        this.WikiLink = QuestData[quest]['wikiLink']
        this.Experience = QuestData[quest]['exp']
        this.Giver = QuestData[quest]['giver'].name
    }
}

exports.QuestInfo = QuestInfo