// A module for grabbing item data
import path from 'path'
import { ReadJson } from '../lib'

const game_data = path.join(__dirname, '..', '..', 'game_data')

export class Cache {
    static itemData: Item[]
    static rawData: { [key: string]: any }
    static questData: TrackerQuest[]
    static barterData: Barter[]
    static locales: { [key: string]: any; templates: any }
    static globals: { [key: string]: any }
    static bulletData: Bullet[]
    static hideoutData: HideoutModule[]
    static rawQuestData: any

    static map: { [key: string]: number } = {}
    static shorts: { [key: string]: Item } = {}

    constructor() {
        this.updateData()
    }

    updateData() {
        Cache.itemData = ReadJson<Item[]>(path.join(game_data, 'api', 'itemdata.json'))
        Cache.rawData = ReadJson(path.join(game_data, 'database', 'templates', 'items.json'))
        Cache.questData = ReadJson<TrackerQuest[]>(path.join(game_data, 'api', 'questdata.json'))
        Cache.barterData = ReadJson<Barter[]>(path.join(game_data, 'api', 'barterdata.json'))
        Cache.locales = ReadJson(path.join(game_data, 'database', 'locales', 'global', 'en.json'))
        Cache.globals = ReadJson(path.join(game_data, 'database', 'globals.json'))
        Cache.bulletData = ReadJson<Bullet[]>(path.join(game_data, 'api', 'bulletdata.json'))
        Cache.hideoutData = ReadJson<HideoutModule[]>(path.join(game_data, 'api', 'hideoutdata.json'))
        Cache.rawQuestData = ReadJson<any>(path.join(game_data, 'database', 'templates', 'quests.json'))
        Cache.itemData.forEach((item, i) => {
            Cache.map[item.id] = i
            Cache.shorts[item.shortName.toLowerCase()] = item
        })
    }
}

new Cache()

// Items

// Return object of item with matching input field
// A search engine that looks for exact matches
export function GetItem(input: string): Item {
    const itemData = Cache.itemData
    return itemData[Cache.map[input]]
}

type DBItem = {
    raw: any
    rawName: string
    locals: any
    key?: string[]
}

export function isID(id: string): boolean {
    if (Cache.map[id] !== undefined) return true
    else return false
}

export function isShortName(name: string): Item | null {
    return Cache.shorts[name.toLowerCase()] ?? null
}

export function GetDBItem(item: string): DBItem {
    const rawData = Cache.rawData
    const locals = Cache.locales.templates
    const keyData = ReadJson<{ [key: string]: string[] }>(path.join(__dirname, '..', '..', 'game_data', 'keys.json'))

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

export function GetQuest(index: number): TrackerQuest {
    const questData: TrackerQuest[] = Cache.questData
    return questData[index]
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
