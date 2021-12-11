// A module for searching for items
import MiniSearch from 'minisearch'
import { ErrorMessage, GetItem, GetShortName } from '../../Lib'
import { Cache, isID } from '../GameData'

const Items = Cache.itemData.map((item: Item) => {
    return {
        id: item.id,
        name: item.name,
        shortName: item.shortName,
        types: item.types
    }
})

const engine = new MiniSearch({
    fields: ['name', 'shortName'],
    storeFields: ['name', 'types'],
    idField: 'id'
})

engine.addAll(Items)

export function SearchEngine(input: string | undefined, obj?: { types?: ItemType[]; excludedTypes?: ItemType[] }) {
    if (input === undefined) return { results: [], error: null }

    let engineResults = new Array()
    let found = false

    if (isID(input)) {
        const item = GetItem(input)
        engineResults.push(item)
        found = true
    }

    if (!found) {
        const foundShorts = GetShortName(input)
        if (!Array.isArray(foundShorts) && foundShorts !== undefined) {
            engineResults.push(foundShorts)
            found = true
        } else if (!found) {
            engineResults = engine.search(input)

            let fuzzy = 1
            while (engineResults.length == 0) {
                engineResults = engine.search(input, { fuzzy: fuzzy / 100 })
                fuzzy++
            }
        }
    }

    const types = obj?.types ?? []
    const excludedTypes = obj?.excludedTypes ?? []

    let results = engineResults.filter((result) => {
        let itemTypes = result.types

        try {
            let positive = itemTypes.filter((t: ItemType) => types.includes(t))
            let negative = itemTypes.filter((t: ItemType) => excludedTypes.includes(t))

            if (negative.length > 0) {
                return false
            }
            if (positive.length > 0) {
                return true
            }
            if (positive.length < 1 && types.length > 0) {
                return false
            }
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    })

    let error: any = null
    if (results.length < 1 && types.length < 1) {
        error = ErrorMessage(`Item search of \"${input}\" came back with no results`)
    } else if (results.length < 1 && types.length > 0) {
        error = ErrorMessage(`Item search of \"${input}\" came back with results but is not of the types: **${types.join(', ')}**`)
    } else if (results.length >= 25) {
        results = results.slice(0, 24)
        //error = ErrorMessage(`Item search of \"${input}\" came back with over 25 results, please be more specific`)
    }

    if (!Array.isArray(results)) results = [results]

    return { results, error: error }
}
