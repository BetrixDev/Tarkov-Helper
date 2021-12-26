type ItemType =
    | 'any'
    | 'ammo'
    | 'armor'
    | 'backpack'
    | 'barter'
    | 'glasses'
    | 'grenade'
    | 'gun'
    | 'helmet'
    | 'keys'
    | 'markedOnly'
    | 'mods'
    | 'noFlea'
    | 'provisions'
    | 'unLootable'
    | 'wearable'
    | 'rig'
    | 'headphones'
    | 'suppressor'
    | 'disabled'

type TraderName = 'prapor' | 'therapist' | 'fence' | 'skier' | 'peacekeeper' | 'mechanic' | 'ragman' | 'jaeger'

type ItemSourceName =
    | 'prapor'
    | 'therapist'
    | 'fence'
    | 'skier'
    | 'peacekeeper'
    | 'mechanic'
    | 'ragman'
    | 'jaeger'
    | 'fleaMarket'

type RequirementType = 'playerLevel' | 'loyaltyLevel' | 'questCompleted'

type GameProperty = {
    key?: string
    numericValue?: number
    stringValue?: string
    arrayValue?: string[]
    objectValue?: string
}

type Item = {
    id: string
    name: string
    normalizedName: string
    shortName: string
    width: number
    height: number
    wikiLink: string
    types: ItemType[]
    avg24hPrice: number
    traderPrices: TraderPrice[]
    lastLowPrice: number
    changeLast48h: number
    sellFor: [ItemPrice]
    buyFor: [ItemPrice]
}

type ItemPrice = {
    source: ItemSourceName
    price: number
    currency?: string
    requirements?: PriceRequirement[]
}

type PriceRequirement = {
    type: RequirementType
    value: number
}

type TaskItem = {
    item: Item
    count: number
}

type Barter = {
    source: string
    requiredItems: TaskItem[]
    rewardItems: TaskItem[]
}

type Craft = {
    source?: string
    duration?: number
    requiredItems?: TaskItem[]
    rewardItems?: TaskItem[]
}

type Trader = {
    id?: string
    name: string
}

type TraderInventory = {
    id?: string
    name?: TraderName
    items?: TraderInventoryItem[]
}

type TraderInventoryItem = {
    item?: Item
    minLevel?: number
    price?: number
    updated?: string
    questUnlockId?: string
    currency?: string
}

type QuestRequirement = {
    level?: number
    quests?: [[number]]
    prerequisiteQuests?: [[Quest]]
}

type QuestRewardReputation = {
    trader?: Trader
    amount?: number
}

type QuestObjective = {
    id?: string
    type?: string
    target?: string[]
    targetItem?: Item
    number?: number
    location?: string
}

type Quest = {
    id?: string
    requirements?: QuestRequirement
    giver?: Trader
    turnin?: Trader
    title?: string
    wikiLink?: string
    exp?: number
    unlocks?: string[]
    reputation?: QuestRewardReputation[]
    objectives?: QuestObjective[]
}

type TraderPrice = {
    price: number
    trader: Trader
}

type HideoutModuleItemRequirement = {
    item?: Item
    quantity?: number
}

type HideoutModule = {
    name?: string
    level?: number
    itemRequirements?: HideoutModuleItemRequirement[]
    moduleRequirements?: HideoutModule[]
}

type Query = {
    item(id: string): Item
    itemsByType(type: ItemType): Item[]
    itemsByName(name: string): Item[]
    barters: Barter[]
    crafts: Craft[]
    quests: Quest[]
    hideoutModules: HideoutModule[]
}

type TrackerQuest = {
    id: number
    require: { level: number; quests: [] }
    giver: number
    turning: number
    title: string
    locales: { en: string; ru: string; cs: string }
    wiki: string
    exp: number
    unlocks: string[]
    reputation: { trader: number; rep: number }[]
    objectives: {
        type: string
        target: string
        number: number
        location: number
        id: number
    }[]

    gameId: string
}

interface Bullet {
    id: string
    name: string
    shortName: string
    weight: number
    caliber: string
    stackMaxSize: number
    tracer: boolean
    tracerColor: 'red' | 'green'
    ammoType: 'bullet' | 'buckshot' | 'grenade'
    projectileCount: number
    ballistics: {
        damage: number
        armorDamage: number
        fragmentationChance: number
        ricochetChance: number
        penetrationChance: number
        penetrationPower: number
        accuracy: number
        recoil: number
        initialSpeed: number
    }
}
