var QuestNames = require('../game_data/questnames.json')

const QuestSearchEngine = (Input) => {
    let SearchItem = ""
    for (let Arg in Input) {
        SearchItem = SearchItem + " " + Input[Arg]
    }
    let SearchItemArray = SearchItem.split(" ")
    SearchItemArray.shift()
    SearchItem = SearchItemArray.join(" ")
    if (SearchItem !== undefined && SearchItem.length > 2) {
        let SearchResults = new Array()
        let ItemResults = new Array()
        for (const Item in QuestNames) {
            if (SearchResults[0] === 'FoundExact') {

            } else if (SearchItem.toLocaleLowerCase() === QuestNames[Item].Name.toLocaleLowerCase()) {
                SearchResults = []
                SearchResults = [QuestNames[Item].Name]
                ItemResults.push(Item)
            } else if (Item.toLowerCase().includes(SearchItem.toLowerCase())) {
                SearchResults.push(QuestNames[Item].Name)
                ItemResults.push(Item)
            }
        }
        return [SearchItem, SearchResults]
    }
}

exports.QuestSearchEngine = QuestSearchEngine;