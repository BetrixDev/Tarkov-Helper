import fuse from 'fuse.js'
import { fetchData } from '../../data/cache'

interface EngineParams {
    id: string
    name: string
}

type SearchResult = fuse.FuseResult<EngineParams>[]

let engines: { [key: string]: fuse<EngineParams> } = {}

export const initEngines = () => {
    let enValues: EngineParams[] = []
    let esValues: EngineParams[] = []
    let ruValues: EngineParams[] = []
    let geValues: EngineParams[] = []

    const questData = fetchData<RawQuest[]>('questData')
    const enLocales = fetchData<Locales>('en').quest
    const esLocales = fetchData<Locales>('es').quest
    const ruLocales = fetchData<Locales>('ru').quest
    const geLocales = fetchData<Locales>('ge').quest

    questData.forEach(({ id, gameId }) => {
        enValues.push({ name: enLocales[gameId].name, id: id.toString() })
        esValues.push({ name: esLocales[gameId].name, id: id.toString() })
        ruValues.push({ name: ruLocales[gameId].name, id: id.toString() })
        geValues.push({ name: geLocales[gameId].name, id: id.toString() })
    })

    engines['en'] = new fuse(enValues, { keys: ['name'] })
    engines['es'] = new fuse(esValues, { keys: ['name'] })
    engines['ru'] = new fuse(ruValues, { keys: ['name'] })
    engines['ge'] = new fuse(geValues, { keys: ['name'] })

    Object.freeze(engines)
}

export const questSearchEngine = (input: string, language: Languages): SearchResult => {
    return engines[language].search<EngineParams>(input).slice(0, 24)
}
