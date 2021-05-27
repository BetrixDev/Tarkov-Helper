const AccurateSearch = require('accurate-search')

const ItemID = require('../game_data/api/itemfromid.json')
const ItemName = require('../game_data/api/itemarray.json')
const ItemShortName = require('../game_data/api/itemfromshortname.json')

let SearchEngine = new AccurateSearch()

for (const Item of ItemName) {
    SearchEngine.addText(Item, Item)
}

const Engine = (Input) => {
    let Results = new Array()

    // Made short name search need a prefix since I don't know a great way to 
    // implement it without making it less user-friendly
    // Also some items are inacessible using short names since they share the name
    // with another item
    if (ItemShortName[Input.replace('short=', '')] !== undefined && Input.includes('short=')) {
        return [ItemShortName[Input.replace('short=', '')].Name]
    }

    if (ItemID[Input.replace('id=', '')] !== undefined) {
        return [ItemID[Input.replace('id=', '')].Name]
    }

    Input = Input.replace('short=', '')

    if (ItemName.includes(Input.toLowerCase())) {
        return [Input]
    } else {
        for (const Item in ItemName) {
            if (ItemName[Item].toLowerCase() === Input.toLowerCase()) {
                Results.push(ItemName[Item])
            }
        }
        if (Results.length > 0) {
            return Results
        }
    }

    for (const Item in ItemName) {
        if (ItemName[Item].toLowerCase().split('.').join('').includes(Input.split('.').join(''))) {
            Results.push(ItemName[Item])
        }
    }

    if (Results.length > 10) {
        if (ItemShortName[Input.replace('short=', '')] !== undefined) {
            return [ItemShortName[Input.replace('short=', '')].Name]
        }
    }

    if (Results.length === 0) {
        Results = SearchEngine.accurateSearch(Input)
    }

    return Results

}

exports.ItemSearchEngine = Engine