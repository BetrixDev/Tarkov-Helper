import { AutocompleteInteraction } from 'discord.js'
import fuse from 'fuse.js'
import { queryDatabase } from '../../database/Server'
import { getCalibers } from '../../helpers/CaliberGrabber'

interface EngineParams {
    key: string
    name: string
}

let engines: { [key: string]: fuse<EngineParams> } = {}

export const initEngines = () => {
    const calibers = getCalibers()
    const engineValues: EngineParams[] = Object.keys(calibers).map((caliber) => {
        return { key: calibers[caliber], name: caliber }
    })

    engines['en'] = new fuse(engineValues, { keys: ['name'] })
}

export const caliberSearchEngine = (input: string) => {
    return engines['en'].search<EngineParams>(input).slice(0, 25)
}

export const autoCompleteResults = async (interaction: AutocompleteInteraction) => {
    const serverData = await queryDatabase(interaction.guildId ?? '')

    const input = interaction.options.getFocused(true).value.toString()

    const results = caliberSearchEngine(input)

    interaction.respond(results.map((r) => ({ name: r.item.name, value: r.item.key })))
}
