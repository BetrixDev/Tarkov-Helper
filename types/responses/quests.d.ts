interface TrackerQuest {
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
    objectives: Objective[]

    gameId: string
}

interface Objective {
    type: string
    target: string
    number: number
    location: number
    id: number
}
