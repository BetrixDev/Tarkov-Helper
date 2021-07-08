const fs = require('fs')
const AccurateSearch = require('accurate-search')

const ItemID = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromid.json'))
const ItemName = JSON.parse(fs.readFileSync('./src/game_data/api/itemarray.json'))
const ItemShortName = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromshortname.json'))

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

    // // User inputted regular name
    // if (ItemName.map(item => { return item.toLowerCase() }).includes(Input.toLowerCase())) {
    //     return [Input]
    // }

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