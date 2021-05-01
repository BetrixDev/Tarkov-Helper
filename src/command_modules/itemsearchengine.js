const ItemName = require('../game_data/itemarray.json')
const ItemShortName = require('../game_data/itemfromshortname.json')

const Engine = (Input) => {
    let Results = new Array()

    // Made short name search need a prefix since I don't know a great way to 
    // implement it without making it less user-friendly
    if (ItemShortName[Input.replace('short=', '')] !== undefined && Input.includes('short=')) {
        return [ItemShortName[Input.replace('short=', '')].Name]
    }

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