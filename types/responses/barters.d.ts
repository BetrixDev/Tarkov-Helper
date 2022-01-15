interface Barter {
    source: string
    requiredItems: TaskItem[]
    rewardItems: TaskItem[]
}

interface TaskItem {
    item: Item
    count: number
}
