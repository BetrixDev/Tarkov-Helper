// A module for grabbing item data
import path from 'path'
import { ReadJson } from '../Lib'

const game_data = path.join(__dirname, '..', '..', 'game_data')

export class Cache {
    static itemData: Item[]
    static rawData: { [key: string]: any }
    static questData: TrackerQuest[]
    static barterData: Barter[]
    static locals: { [key: string]: any; templates: any }
    static globals: { [key: string]: any }
    static bulletData: Bullet[]

    constructor() {
        this.updateData()
    }

    updateData() {
        Cache.itemData = ReadJson<Item[]>(path.join(game_data, 'api', 'itemdata.json')) as Item[]
        Cache.rawData = ReadJson(path.join(game_data, 'database', 'templates', 'items.json'))
        Cache.questData = ReadJson<Quest[]>(path.join(game_data, 'api', 'questdata.json'))
        Cache.barterData = ReadJson<Barter[]>(path.join(game_data, 'api', 'barterdata.json'))
        Cache.locals = ReadJson(path.join(game_data, 'database', 'locales', 'global', 'en.json'))
        Cache.globals = ReadJson(path.join(game_data, 'database', 'globals.json'))
        Cache.bulletData = ReadJson<{ [key: string]: Bullet }>(path.join(game_data, 'api', 'bulletdata.json'))
    }
}

new Cache()

const data = Cache.itemData

let map: { [key: string]: number } = {}

data.forEach((item, i) => {
    map[item.id] = i
})

// Items

// Return object of item with matching input field
// A search engine that looks for exact matches
export function GetItem(input: string): Item {
    const itemData = Cache.itemData
    return itemData[map[input]]
}

export function GetShortName(input: string) {
    const itemData = Cache.itemData

    const item: Item[] = itemData.filter((i: Item) => i.shortName.toLowerCase() == input.toLowerCase())

    if (item.length > 1) {
        return item
    } else {
        return item[0]
    }
}

export function isID(id: string): boolean {
    if (map[id] !== undefined) return true
    else return false
}

type DBItem = {
    raw: any
    rawName: string
    locals: any
    key?: string[]
}

export function GetDBItem(item: string): DBItem {
    const rawData = Cache.rawData
    const locals = Cache.locals.templates
    const keyData = ReadJson(path.join(__dirname, '..', '..', 'game_data', 'keys.json'))

    let obj: DBItem = {
        raw: rawData[item]?._props,
        rawName: rawData[item]?._name,
        locals: locals[item]
    }

    if (keyData[item] !== undefined) {
        obj['key'] = keyData[item]
    }

    return obj
}

export function GetItemByType(type: ItemType) {
    const itemData = Cache.itemData
    return itemData.filter((item) => {
        if (item.types !== undefined) return item.types.includes(type)
        else return false
    })
}

// Quests

export function GetQuest(id: number): TrackerQuest {
    const questData: TrackerQuest[] = Cache.questData
    return questData[id]
}

// Barter

export function GetBarter(id: string): Barter[] {
    const barterdata = Cache.barterData

    let barters: Barter[] = []

    barterdata.forEach((barter) => {
        barter.rewardItems.forEach((reward) => {
            if (reward.item.id == id) {
                barters.push(barter)
            }
        })
    })

    return barters
}
