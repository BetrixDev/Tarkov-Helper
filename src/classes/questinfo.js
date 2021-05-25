const QuestData = require('../game_data/api/quests.json')
const QuestImages = require('../game_data/questimages.json')

class QuestInfo {
    constructor(quest) {
        this.QuestName = quest
        this.QuestImage = this.Image()
        this.WikiLink = QuestData[quest]['wikiLink']
        this.Experience = QuestData[quest]['exp']
        this.Giver = QuestData[quest]['giver'].name
        this.Unlocks = QuestData[quest]['unlocks']
        this.Kappa = QuestData[quest]['Kappa']
    }
    Image() {
        try {
            return `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/quest_icons/${QuestImages[this.QuestName].ImageID}.jpg`
        } catch {
            return ''
        }
    }
}

exports.QuestInfo = QuestInfo