interface HideoutModule {
    id: number
    name: string
    level: number
    itemRequirements: HideoutModuleItemRequirement[]
    moduleRequirements: { id: number; name: string; level: number }[]
}

interface HideoutModuleItemRequirement {
    item: { id: string }
    count: number
}
