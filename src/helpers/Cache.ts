import { Interaction } from 'discord.js'

type Data = {
    [key: string]: {}
}

export interface InteractionData extends Data {
    interaction: Interaction
}

let Cache: { [key: string]: InteractionData } = {}

export const ReadCache = (key: string) => Cache[key]

export const AppendCache = async (key: string, value: InteractionData) => (Cache[key] = value)
