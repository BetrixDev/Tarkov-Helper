import 'reflect-metadata'
import { AutocompleteInteraction } from 'discord.js'
import fuse from 'fuse.js'
import { fetchData } from '../../data/cache'
import { Item } from '../../data/classes/item'
import { queryDatabase } from '../../database/server'

interface ExtraOptions {
    types?: ItemType[]
    excludedTypes?: ItemType[]
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
    let ruValues: EngineParams[] = []
    let geValues: EngineParams[] = []

    const itemData = fetchData<TarkovToolsItem[]>('itemData')
    const itemProps = fetchData<{ [key: string]: RawItem }>('itemProps')

    itemData
        .filter((i) => !i.types.includes(TarkovToolsTypes.Disabled) && itemProps[i.id] !== undefined)
        .forEach((i) => {
            const enItem = new Item(i.id, 'en')
            const esItem = new Item(i.id, 'es')
            const ruItem = new Item(i.id, 'ru')
            const geItem = new Item(i.id, 'ge')

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
            ruValues.push({
                id: ruItem.id,
                types: ruItem.types,
                name: ruItem.name,
                shortName: ruItem.shortName
            })
            geValues.push({
                id: geItem.id,
                types: geItem.types,
                name: geItem.name,
                shortName: geItem.shortName
            })
        })

    engines['en'] = new fuse(enValues, { keys: ['id', 'name', 'shortName'] })
    engines['es'] = new fuse(esValues, { keys: ['id', 'name', 'shortName'] })
    engines['ru'] = new fuse(ruValues, { keys: ['id', 'name', 'shortName'] })
    engines['ge'] = new fuse(geValues, { keys: ['id', 'name', 'shortName'] })

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

        return results.filter((r) => {
            const rTypes = r.item.types

            const bad = rTypes.filter((value) => excludedTypes.includes(value))
            const good = rTypes.filter((value) => types.includes(value))

            if (bad.length > 0) return false
            if (good.length > 0) return true
            if (types.length > 0 && good.length < 1) return false
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
