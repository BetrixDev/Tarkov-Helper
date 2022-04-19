import 'reflect-metadata'
import { AutocompleteInteraction } from 'discord.js'
import fuse from 'fuse.js'
import { fetchData } from '../../Cache'
import { Item } from '../game/Item'
import { queryDatabase } from '../../database/Server'
import { ItemType, RawItem, TarkovToolsItem } from '../../types/game/Item'

interface ExtraOptions {
    types?: ItemType[]
    excludedTypes?: ItemType[]
    guard?: (item: Item) => boolean
}

interface EngineParams {
    id: string
    name: string
    shortName: string
    types: ItemType[]
}

let engines: { [key: string]: fuse<EngineParams> } = {}

export const initEngines = () => {
    let enValues: EngineParams[] = []
    let esValues: EngineParams[] = []

    const itemData = fetchData<TarkovToolsItem[]>('itemData')
    const itemProps = fetchData<{ [key: string]: RawItem }>('itemProps')

    itemData
        .filter((i) => !i.types.includes('disabled') && itemProps[i.id] !== undefined)
        .forEach((i) => {
            const enItem = new Item(i.id, 'en')
            const esItem = new Item(i.id, 'es')

            enValues.push({
                id: enItem.id,
                types: enItem.types,
                name: enItem.name,
                shortName: enItem.shortName
            })
            esValues.push({
                id: esItem.id,
                types: esItem.types,
                name: esItem.name,
                shortName: esItem.shortName
            })
        })

    engines['en'] = new fuse(enValues, { keys: ['id', 'name', 'shortName'] })
    engines['es'] = new fuse(esValues, { keys: ['id', 'name', 'shortName'] })

    Object.freeze(engines)
}

type SearchResult = fuse.FuseResult<EngineParams>[]

export const itemSearchEngine = (input: string, language: Languages, extras?: ExtraOptions): SearchResult => {
    const engine = engines[language]
    const results = engine.search<EngineParams>(input).slice(0, 24)

    if (!extras) {
        return results
    } else {
        const types = extras.types ?? []
        const excludedTypes = extras.excludedTypes ?? []

        return results
            .filter((r) => {
                const rTypes = r.item.types

                const bad = rTypes.filter((value) => excludedTypes.includes(value))
                const good = rTypes.filter((value) => types.includes(value))

                if (bad.length > 0) return false
                if (good.length > 0) return true
                if (types.length > 0 && good.length < 1) return false
                return true
            })
            .filter((r) => {
                if (extras.guard) {
                    return extras.guard(new Item(r.item.id, 'en'))
                }

                return true
            })
    }
}

export const autoCompleteResults = async (interaction: AutocompleteInteraction, extras?: ExtraOptions) => {
    const serverData = await queryDatabase(interaction.guildId ?? '')

    const input = interaction.options.getFocused(true).value.toString()

    const results = itemSearchEngine(input, serverData.Language, extras)

    interaction.respond(results.map((r) => ({ name: r.item.name, value: r.item.id })))
}