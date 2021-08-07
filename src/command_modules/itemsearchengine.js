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

function GetMatchingPercent(searchTerm, input) {
    let search = searchTerm.split(' ')
    let name = input

    let matches = 0

    search.forEach(word => {
        let index = name.indexOf(word)

        if (index >= 0) {
            matches++
            name = name.substr(0, index) + name.substr(index + word.length + 1, name.length)
        }
    })

    let percentage = matches / input.length

    if (!percentage) {
        matches = 0

        search.forEach(char => {
            let index = name.indexOf(char)

            if (index >= 0) {
                matches++
                name = name.substr(0, index) + name.substr(index + 1, name.length)
            }
        })

        percentage = matches / input.split('').length * 0.5
    }

    if (percentage) {
        return { matches, percentage, itemData: ItemName[input] }
    } else {
        return null
    }
}

const Engine = (Input) => {

    let percentages = new Array()
    for (let name in ItemName) {
        let matchData = GetMatchingPercent(Input, name)

        if (matchData) {
            percentages.push(matchData)
        }
    }
    percentages = percentages.sort((a, b) => b.percentage - a.percentage).splice(0, 24)

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

    if (LongResults.length > 25 || ShortResults.length > 25) {
        return percentages.map(item => { return item.itemData.Name })
    }

    if (LongResults.length > ShortResults.length) {
        return LongResults
    } else {
        return ShortResults.map(item => {
            return ItemShortName[item.toLowerCase()].Name
        })
    }

}

exports.ItemSearchEngine = Engine