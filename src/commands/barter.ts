import 'reflect-metadata'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { autoCompleteResults } from '../helpers/search_engines/item-engine'
import { handleCommandInteraction, translation } from '../lib'
import { ErrorMessages, ItemCommand } from './item'
import { itemIdFromString } from '../data/cache'

@Discord()
export class BarterCommand {
    @Slash('barter', { description: 'Calculates the price and profit of the specified barter' })
    async barter(
        @SlashOption('item', {
            description: 'item to get info of (start typing to search)',
            type: 'STRING',
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction)
        })
        id: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                respond(BarterCommand.message(id, Language))
            })
        )
    }

    static message(input: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        // // Make sure item is a real item
        const id = itemIdFromString(input)
        if (!id) throw new Error(t(ErrorMessages.USE_AUTO_COMPLETE))

        return ItemCommand.barterMessage(id, language, 0, false)
    }
}
