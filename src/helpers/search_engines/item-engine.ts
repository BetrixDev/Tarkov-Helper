import fuse from 'fuse.js'
import { ReadJson } from '../../lib'

interface ExtraOptions {
    types?: ItemType[]
    excludedTypes?: ItemType[]
}

interface EngineParams {
    id: string
    name: string
    shortName: string
    types: ItemType[]
}

const ItemData = ReadJson<Item[]>('game_data/api/itemdata.json')
const EngineValues: EngineParams[] = ItemData.filter((item) => {
    return !item.types.includes('disabled')
}).map((item) => {
    return { id: item.id, name: item.name, shortName: item.shortName, types: item.types }
})

const Fuse = new fuse(EngineValues, { keys: ['id', 'name', 'shortName'] })

export default (input: string, obj?: ExtraOptions) => {
    const results = Fuse.search<EngineParams>(input).slice(0, 25)

    if (!obj) {
        return results
    } else {
        const types = obj?.types ?? []
        const excludedTypes = obj?.excludedTypes ?? []

        return results.filter((result) => {
            const itemTypes = result.item.types

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
    }
}
