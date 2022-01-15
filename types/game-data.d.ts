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
    item: { id: string }
    count: number
}

type HideoutModule = {
    id: number
    name: string
    level: number
    itemRequirements: HideoutModuleItemRequirement[]
    moduleRequirements: { id: number; name: string; level: number }[]
}

type TrackerQuest = {
    id: number
    require: { level: number; quests: [] }
    giver: number
    turnin: number
    title: string
    locales: { en: string; ru: string; cs: string }
    wiki: string
    exp: number
    nokappa?: boolean
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

type Status = {
    name: string
    message: string
    status: number
    statusCode: string
}

type StatusMessage = {
    content: string
    time: string
    type: number
    solveTime: string
    statusCode: string
}

type ServerStatus = {
    currentStatuses: [Status]
    messages: [StatusMessage]
    generalStatus: Status
}
