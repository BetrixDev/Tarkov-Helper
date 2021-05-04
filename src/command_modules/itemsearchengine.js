const ItemID = require('../game_data/itemfromid.json')
const ItemName = require('../game_data/itemarray.json')
const ItemShortName = require('../game_data/itemfromshortname.json')

const Engine = (Input) => {
    let Results = new Array()

    // Made short name search need a prefix since I don't know a great way to 
    // implement it without making it less user-friendly
    // Also some items are inacessible using short names since they share the name
    // with another item
    if (ItemShortName[Input.replace('short=', '')] !== undefined && Input.includes('short=')) {
        return [ItemShortName[Input.replace('short=', '')].Name]
    }

    if (ItemID[Input.replace('id=', '')] !== undefined && Input.includes('id=')) {
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

    return Results

}

exports.ItemSearchEngine = Engine