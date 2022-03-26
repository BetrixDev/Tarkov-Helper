import 'reflect-metadata'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { autoCompleteResults } from '../lib/search_engines/ItemEngine'
import { handleCommandInteraction, translation } from '../Lib'
import { ErrorMessages, ItemCommand } from './Item'
import { itemIdFromString } from '../Cache'

@Discord()
export abstract class StatCommand {
    @Slash('stat', { description: 'Returns information about the specified item' })
    async stat(
        @SlashOption('item', {
            description: 'item to get stats of (start typing to search)',
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
                respond(ItemCommand.statsMessage(id, Language))
            })
        )
    }

    static message(input: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        // Make sure item is a real item
        const id = itemIdFromString(input)
        if (!id) {
            throw new Error(t(ErrorMessages.USE_AUTO_COMPLETE))
        }

        return ItemCommand.statsMessage(id, language)
    }
}
