import { readFileSync } from 'jsonfile'
import { readdirSync } from 'fs'
import { RawBarter } from './types/game/Barter'
import { RawItem, TarkovToolsItem } from './types/game/Item'

// Raw game data and/or other data is stored in this object
// files are also stored on disk to speed of start times for dev enviroments

let data: { [key: string]: any } = {}

export const updateData = async (): Promise<undefined> => {
    // Store new data in memory
    readdirSync('./data/')
        .filter((f) => f.endsWith('.json'))
        .forEach((file) => {
            const fileData = readFileSync(`./data/${file}`)
            data[file.replace('.json', '')] = fileData
        })

    // Fetch item types
    data.itemTypes = {}
    const itemProps = fetchData<{ [key: string]: RawItem }>('itemProps')

    Object.entries(itemProps).forEach(([k, v]) => {
        if (v._type === 'Node') {
            data.itemTypes[k] = v._name
        }
    })

    // Store an item map for faster fetching of itemData
    data.itemMap = {}
    const itemData = readFileSync('./data/itemData.json') as TarkovToolsItem[]
    itemData.forEach((item, i) => {
        data.itemMap[item.id] = i
    })

    return
}

export const fetchData = <T>(key: string): T => {
    return data[key] as T | any
}

export const getRawItem = (id: string) => {
    return data['rawItems'][id] as RawItem
}

/**Returns all barters that give rewardItem as a reward */
export const getBarter = (rewardItem: string) => {
    return fetchData<RawBarter[]>('barterData').filter((barter) => {
        return (
            barter.rewardItems.filter((r) => {
                return r.item.id === rewardItem
            }).length !== 0
        )
    })
}

export const itemIdFromString = (str: string): string | undefined => {
    let id: string | undefined

    if (data['itemProps'][str] !== undefined) {
        id = str
    }

    if (id === undefined) {
        const itemData = data['itemData'] as TarkovToolsItem[]

        for (let i = 0; i < itemData.length; i++) {
            if (id !== undefined) break

            const item = itemData[i]

            if (
                item.shortName.toLocaleLowerCase() === str.toLocaleLowerCase() &&
                itemData.filter((item) => item.shortName.toLocaleLowerCase() === str.toLocaleLowerCase()).length === 1
            ) {
                id = item.id
            } else if (item.name.toLocaleLowerCase() === str.toLocaleLowerCase()) {
                id = item.id
            }
        }
    }

    return id
}
