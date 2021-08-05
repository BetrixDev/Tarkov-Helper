require('../utils')
const AccurateSearch = require('accurate-search')

const ItemID = ReadJson('./src/game_data/api/itemfromid.json')
const ItemShortName = ReadJson('./src/game_data/api/itemfromshortname.json')
let ItemName = ReadJson('./src/game_data/api/itemfromname.json')

let newItemName = new Object()
for (let name in ItemName) {
    let itemData = ItemName[name]
    newItemName[name.toLowerCase()] = {
        ...itemData
    }
}
ItemName = newItemName

let SearchEngine = new AccurateSearch()
let ShortSearchEngine = new AccurateSearch()

for (const i in ItemShortName) {
    let Item = ItemShortName[i]
    SearchEngine.addText(Item.Name, Item.Name)
    ShortSearchEngine.addText(Item.ShortName, Item.ShortName)
}

const Engine = (Input) => {

    // User inputted item id
    if (ItemID.hasOwnProperty(Input)) {
        return [ItemID[Input].Name]
    }

    // User inputted short name
    if (ItemShortName.hasOwnProperty(Input.toLowerCase())) {
        return [ItemShortName[Input.toLowerCase()].Name]
    }
    if (ItemShortName.hasOwnProperty(Input.toLowerCase().replace(' ', '-'))) {
        return [ItemShortName[Input.toLowerCase().replace(' ', '-')].Name]
    }

    // User inputted regular name
    if (ItemName.hasOwnProperty(Input.toLowerCase())) {
        return [Input]
    }

    let LongResults = SearchEngine.accurateSearch(Input)
    let ShortResults = ShortSearchEngine.accurateSearch(Input)

    if (LongResults.length > ShortResults.length) {
        return LongResults
    } else {
        return ShortResults.map(item => {
            return ItemShortName[item.toLowerCase()].Name
        })
    }

}

exports.ItemSearchEngine = Engine