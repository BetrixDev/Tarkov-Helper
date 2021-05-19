const AccurateSearch = require('accurate-search')
const fs = require('fs')

const Maps = require('../game_data/maps.json')

let SearchEngine = new AccurateSearch()

function InitEngine() {
    for (const Map of Maps) {
        SearchEngine.addText(Map, Map)
    }
}

function Engine(Input) {
    let Results = SearchEngine.search(Input)

    return Results[0]
}

exports.InitMapEngine = InitEngine
exports.MapSearchEngine = Engine