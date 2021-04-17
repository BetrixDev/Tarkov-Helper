const QuestFromName = require('../game_data/quest-name.json')
const QuestData = require('../game_data/quest-data.json')
const QuestStrings = require('../game_data/quest-strings.json')
const Mail = require('../game_data/mail.json')

class QuestInfo {
    constructor(quest) {
        this.Quest = quest
        this.QuestName = QuestStrings[quest].name
        this.QuestImage = `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/quest_icons/${this.QuestImageID()}`
        this.WikiLink = `https://escapefromtarkov.fandom.com/wiki/Special:Search?query=${
            this.QuestName.toLowerCase().replace('. ', '_-_').split(' ').join('_').replace('.', '_').replace('pt', 'Part')
        }`
        this.QuestDesc = this.QuestDescription()
    }
    QuestDescription() {
        let Desc = Mail[QuestStrings[this.Quest].description]
        if (Desc != undefined) {
            if (Desc.length > 250) {
                Desc = Desc.substr(0, 250) + "\u2026"
            }
            return Desc
        } else {
            return "Unable to get quest description"
        }
    }
    QuestDataObject() {
        for (const Quest of QuestData) {
            if (Quest._id === this.Quest) {
                return Quest
            }
        }
    }
    QuestImageID() {
        let RawImageID = this.QuestDataObject()['image']
        return RawImageID.replace('/files/quest/icon/', '')
    }
}

exports.QuestInfo = QuestInfo