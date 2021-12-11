import CommandMessage, { Randomizer } from '../commands/roulette'
import { ButtonInteraction, CommandInteraction } from 'discord.js'
import { Map } from '../commands/map'

type Result = {
    map: Map
    helmet: Item
    armor: Item
    gun: Item
}
type RerollVariables = 'map' | 'helmet' | 'all' | 'armor' | 'gun'
type RerollData = [
    {
        interaction: CommandInteraction
        results: Result
    },
    RerollVariables
]

export async function Message(interaction: ButtonInteraction, data: RerollData) {
    const variable = data[1]
    const results = data[0].results

    const preset: { [key: string]: any } = new Randomizer().Results

    if (variable === 'all') {
        await interaction.update(await CommandMessage(data[0].interaction, {}, { preset: preset as Result }))
    } else {
        let mixedResults: { [key: string]: any } = results
        mixedResults[variable] = preset[variable]

        await interaction.update(await CommandMessage(data[0].interaction, {}, { preset: mixedResults as Result }))
    }
}
