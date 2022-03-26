import { AutocompleteInteraction } from 'discord.js'
import fuse from 'fuse.js'
import { fetchData } from '../../Cache'
import { queryDatabase } from '../../database/Server'
import { Locales } from '../../types/game/Locales'
import { RawQuest } from '../../types/game/Quest'

interface EngineParams {
    id: string
    name: string
}

type SearchResult = fuse.FuseResult<EngineParams>[]

let engines: { [key: string]: fuse<EngineParams> } = {}

export const initEngines = () => {
    let enValues: EngineParams[] = []
    let esValues: EngineParams[] = []

    const questData = fetchData<RawQuest[]>('questData')
    const enLocales = fetchData<Locales>('en').quest
    const esLocales = fetchData<Locales>('es').quest

    questData.forEach(({ id, gameId }) => {
        enValues.push({ name: enLocales[gameId].name, id: id.toString() })
        esValues.push({ name: esLocales[gameId].name, id: id.toString() })
    })

    engines['en'] = new fuse(enValues, { keys: ['name'] })
    engines['es'] = new fuse(esValues, { keys: ['name'] })

    Object.freeze(engines)
}

export const questSearchEngine = (input: string, language: Languages): SearchResult => {
    return engines[language].search<EngineParams>(input).slice(0, 24)
}

export const autoCompleteResults = async (interaction: AutocompleteInteraction) => {
    const serverData = await queryDatabase(interaction.guildId ?? '')

    const input = interaction.options.getFocused(true).value.toString()

    const results = questSearchEngine(input, serverData.Language)

    interaction.respond(results.map((r) => ({ name: r.item.name, value: r.item.id })))
}
