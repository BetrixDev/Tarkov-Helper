var ItemNames = require('../game_data/items.json')

const SearchEngine = (Input) => {

    // Convert Input To A Searchable String
    let SearchItem = ""
    for (let Arg in Input) {
        SearchItem = SearchItem + " " + Input[Arg]
    }
    let SearchItemArray = SearchItem.split(" ")
    SearchItemArray.shift()
    SearchItem = SearchItemArray.join(" ")


    // Get A Search Result
    if (SearchItem !== undefined && SearchItem.length > 2) {
        let SearchResults = new Array()
        let ItemResults = new Array()
        for (const Item in ItemNames) {
            if (SearchResults[0] === 'FoundExact') {

            } else if (SearchItem.toLocaleLowerCase() === ItemNames[Item].ShortName.toLocaleLowerCase()) {
                SearchResults = []
                SearchResults = ['FoundExact']
                ItemResults.push(Item)
            } else if (Item.toLowerCase().includes(SearchItem.toLowerCase())) {
                SearchResults.push(ItemNames[Item].ShortName)
                ItemResults.push(Item)
            }
        }

        return [SearchItem, SearchResults, ItemResults]

    }
}

exports.SearchEngine = SearchEngine;