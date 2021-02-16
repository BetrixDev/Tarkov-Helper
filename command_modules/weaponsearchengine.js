// Load modules
const fs = require('fs')

// Load game data
const WeaponData = JSON.parse(fs.readFileSync('./game_data/weaponbuilder/weapons.json'))

// Search engine 
const WeaponSearchEngine = (Input) => {

    let SearchItem = ""
    for (let Arg in Input) {
        SearchItem = SearchItem + " " + Input[Arg]
    }
    let SearchItemArray = SearchItem.split(" ")
    SearchItemArray.shift()
    SearchItem = SearchItemArray.join(" ")

    if (SearchItem !== undefined && SearchItem.length > 1) {

        let SearchResults = new Array()
        let ItemResults = new Array()

        for (const Item in WeaponData) {

            if (SearchResults[0] === 'FoundExact') {

            } else if (SearchItem.toLowerCase() === WeaponData[Item].ShortName.toLowerCase()) {
                SearchResults = []
                SearchResults = ['FoundExact']
                ItemResults.push(Item)
            } else if (Item.toLowerCase().includes(SearchItem.toLowerCase())) {
                SearchResults.push(WeaponData[Item].ShortName)
                ItemResults.push(Item)
            }

        }

        return [SearchItem, SearchResults, ItemResults]

    }
}

exports.WeaponSearchEngine = WeaponSearchEngine;