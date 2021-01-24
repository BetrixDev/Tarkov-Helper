var Calibers = require('../game_data/calibers.json')

const CaliberSearchEngine = (Input) => {
    let SearchItem = ""
    for (let Arg in Input) {
        SearchItem = SearchItem + " " + Input[Arg]
    }
    let SearchItemArray = SearchItem.split(" ")
    SearchItemArray.shift()
    SearchItem = SearchItemArray.join("").replace(".", "")
    if (SearchItem !== undefined && SearchItem.length > 1) {
        let SearchResults = new Array()
        for (const Ammo in Calibers) {
            if (Calibers[Ammo].toLowerCase().includes(SearchItem.toLowerCase())) {
                SearchResults.push(Calibers[Ammo])
            }
        }
        return SearchResults
    }
}

exports.CaliberSearchEngine = CaliberSearchEngine;