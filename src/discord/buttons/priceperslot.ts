import { ButtonInteraction, CommandInteraction } from 'discord.js'
import CommandMessage from '../commands/priceperslot'

type ButtonActions = 'backward' | 'forward'
type PricePerSlotData = [
    {
        interaction: CommandInteraction
        page: number
        minimum: number
        maximum: number
        date: string
        items: Item[]
    },
    ButtonActions
]

export async function Message(buttonInteraction: ButtonInteraction, data: PricePerSlotData) {
    // Acknowledge interaction
    await buttonInteraction.deferUpdate()

    // Either forward or backward
    const { interaction, page, minimum, maximum, items, date } = data[0]
    const action = data[1]

    // Edit orignal interaction's message with new page
    if (action == 'forward') {
        interaction.editReply(await CommandMessage(interaction, { minimum, maximum }, {}, { items, page: Number(page) + 1, date }))
    } else if (action == 'backward') {
        interaction.editReply(await CommandMessage(interaction, { minimum, maximum }, {}, { items, page: Number(page) - 1, date }))
    }
}
