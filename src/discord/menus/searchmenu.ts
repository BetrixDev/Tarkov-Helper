import { CommandInteraction, SelectMenuInteraction } from 'discord.js'

type SearchMenuData = [
    {
        interaction: CommandInteraction
        command: string
        variable: string
        args: { [key: string]: any }
    }
]

export async function Message(interaction: SelectMenuInteraction, data: SearchMenuData): Promise<void> {
    const { command, variable } = data[0]

    // Insert selected item in place of the the old
    let args = data[0].args
    const selection = interaction.values?.[0]
    args[variable] = selection

    // Call the message function and reply to the interaction with the returned content
    const module = require(`../commands/${command}`).default
    await interaction.update(await module(interaction, args))
}
