const fs = require('fs')
const QuestData = JSON.parse(fs.readFileSync('./src/game_data/api/quests.json'))
const GunsmithData = JSON.parse(fs.readFileSync('./src/game_data/gunsmith.json'))
const PriceData = JSON.parse(fs.readFileSync('./src/game_data/api/pricedata.json'))
const ItemFromID = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromid.json'))
const QuestImages = require('../game_data/questimages.json')
const FormatPrice = require('../command_modules/formatprice')

class QuestInfo {
    constructor(quest) {
        this.QuestName = quest
        this.QuestImage = this.Image()
        this.WikiLink = QuestData[quest]['wikiLink']
        this.Experience = QuestData[quest]['exp']
        this.Unlocks = QuestData[quest]['unlocks'].map(item => {
            try { return ItemFromID[item].ShortName } catch { return item }
        })
        this.Kappa = QuestData[quest]['Kappa']
    }
    Gunsmith() {
        let Data = GunsmithData[this.QuestName]

        let Price = 0
        let ShoppingList = Data.shoppingList.map(item => {
            let ItemPrice = PriceData[item.id].Item.avg24hPrice
            Price += ItemPrice
            return `**${ItemFromID[item.id].ShortName}** - ${FormatPrice(ItemPrice)}`
        })


        return { ShoppingList, Price: FormatPrice(Price) }
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