import { TarkovToolsItem } from './Item'

export interface RawBarter {
    source: string
    requiredItems: ContainedItem[]
    rewardItems: ContainedItem[]
}

export interface ContainedItem {
    item: TarkovToolsItem
    count: number
    quantity: number
}
