export interface HideoutModule {
    id: number
    name: string
    level: number
    itemRequirements: [ContainedItem]
    moduleRequirements: [HideoutModule]
}
