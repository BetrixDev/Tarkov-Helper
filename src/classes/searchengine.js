require('../utils')
const MiniSearch = require('minisearch')

const ShortNames = ReadJson('./src/game_data/api/itemfromshortname.json')
const ItemNames = ReadJson('./src/game_data/api/itemfromname.json')
const ItemIds = ReadJson('./src/game_data/api/itemfromid.json')

let newArray = new Array()
for (let itemID in ShortNames) {
    newArray.push(ShortNames[itemID])
}

let SearchData = newArray

let engine = new MiniSearch({
    fields: ['Name', 'ShortName'],
    storeFields: ['Name', 'Types'],
    idField: 'ID'
})

engine.addAll(SearchData)

class SearchEngine {
    constructor(obj) {
        this.types = obj?.types || []
        this.excludedTypes = obj?.excludedTypes || []
    }
    Results(input) {
        let error = null

        let types = this.types
        let excludedTypes = this.excludedTypes

        let engineResults = new Array()

        if (ItemIds[input] !== undefined) {
            engineResults.push(ItemIds[input])
        } else if (ItemNames[input] !== undefined) {
            engineResults.push(ItemNames[input])
        } else {
            engineResults = engine.search(input)

            let fuzzy = 1
            while (engineResults.length === 0) {
                engineResults = engine.search(input, { fuzzy: fuzzy / 100 })
                fuzzy++
            }
        }

        let results = engineResults.filter((result) => {
            let itemTypes = result.Types
            try {
                let positive = itemTypes.filter((t) => types.includes(t))
                let negative = itemTypes.filter((t) =>
                    excludedTypes.includes(t)
                )

                if (negative.length > 0) { return false }
                if (positive.length > 0) { return true }
                if (positive.length < 1 && types.length > 0) { return false }
                return true
            } catch {
                return true
            }
        })

        if (results.length < 1 && types.length < 1) {
            error = ErrorMessage(`Item search of \"${input}\" came back with no results`)
        } else if (results.length < 1 && types.length > 0) {
            error = ErrorMessage(`Item search of \"${input}\" came back with results but is not of the types: **${types.join(', ')}**`)
        } else if (results.length >= 25) {
            error = ErrorMessage(`Item search of \"${input}\" came back with over 25 results, please be more specific`)
        }

        return { error, results }
    }
}

exports.Search = SearchEngine
