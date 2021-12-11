// A module for creating a search engine for quests
import MiniSearch from 'minisearch'
import { ReadJson } from '../../Lib'

const Quests: [Quest] = ReadJson('./src/data/game/api/questdata.json').map((quest: Quest) => {
    return {
        id: quest.id,
        title: quest.title
    }
})

const engine = new MiniSearch({
    fields: ['title', 'id'],
    storeFields: ['title'],
    idField: 'id'
})

engine.addAll(Quests)

export function QuestSearchEngine(input: string | number) {
    let engineResults = new Array()

    if (typeof input == 'number') {
        if (input < Quests.length - 1) {
            engineResults.push(Quests[input])
        }
    } else {
        engineResults = engine.search(input)

        let fuzzy = 1
        while (engineResults.length == 0) {
            engineResults = engine.search(input, { fuzzy: fuzzy / 100 })
            fuzzy++
        }
    }

    let highScore = 0
    let secondScore = 0
    engineResults.forEach((result) => {
        if (result.score > highScore) {
            highScore = result.score
        } else if (result.score < secondScore) {
            secondScore = result.score
        }
    })
    let results = engineResults.sort(function (a, b) {
        return (b.score = a.score)
    })
    if (highScore > secondScore * 1.75) {
        results = results.shift()
    }

    if (!Array.isArray(results)) results = [results]

    return results
}
