export interface HideoutModule {
    id: number
    name: string
    level: number
    itemRequirements: {
        item: {
            id: string
        }
        count: number
    }[]
    moduleRequirements: {
        id: number
        name: string
        level: number
    }[]
}
