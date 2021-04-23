const ItemName = require('../game_data/itemarray.json')

const Engine = (Input) => {
    let Results = new Array()

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
        if (ItemName[Item].toLowerCase().split('.').join('').includes(Input)) {
            Results.push(ItemName[Item])
        }
    }
    return Results
}

exports.ItemSearchEngine = Engine