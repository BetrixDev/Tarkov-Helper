import { AutocompleteInteraction } from 'discord.js'
import fuse from 'fuse.js'
import { fetchData } from '../../Cache'
import { HideoutModule } from '../game/Module'
import { queryDatabase } from '../../database/Server'
import { translation } from '../../Lib'
import { HideoutModule as RawHideoutModule } from '../../types/game/Hideout'

interface EngineParams {
    id: string
    name: string
}

type SearchResult = fuse.FuseResult<EngineParams>[]

let engines: { [key: string]: fuse<EngineParams> } = {}

export const initEngines = () => {
    let enValues: EngineParams[] = []
    let esValues: EngineParams[] = []

    const hideoutData = fetchData<RawHideoutModule[]>('hideoutData')

    hideoutData.forEach(({ id, name, level }) => {
        enValues.push({ name: `${new HideoutModule(id, 'en').name} - Level ${level}`, id: id.toString() })
        esValues.push({
            name: `${new HideoutModule(id, 'es').name} - ${translation('es')('Level')} ${level}`,
            id: id.toString()
        })
    })

    engines['en'] = new fuse(enValues, { keys: ['name'] })
    engines['es'] = new fuse(esValues, { keys: ['name'] })

    Object.freeze(engines)
}

export const moduleSearchEngine = (input: string, language: Languages): SearchResult => {
    return engines[language].search<EngineParams>(input).slice(0, 24)
}

export const autoCompleteResults = async (interaction: AutocompleteInteraction) => {
    const serverData = await queryDatabase(interaction.guildId ?? '')

    const input = interaction.options.getFocused(true).value.toString()

    const results = moduleSearchEngine(input, serverData.Language)

    interaction.respond(results.map((r) => ({ name: r.item.name, value: r.item.id })))
}
