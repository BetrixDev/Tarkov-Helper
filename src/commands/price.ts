import 'reflect-metadata'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { autoCompleteResults } from '../helpers/search_engines/item-engine'
import { handleCommandInteraction, translation } from '../lib'
import { ErrorMessages, ItemCommand } from './item'
import { isId } from '../data/cache'

@Discord()
export class PriceCommand {
    @Slash('price', { description: 'Calculates the price and profit of the specified barter' })
    async price(
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
                respond(PriceCommand.message(id, Language))
            })
        )
    }

    static message(id: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        // Make sure item is a real item
        if (!isId(id)) {
            throw new Error(t(ErrorMessages.USE_AUTO_COMPLETE))
        }

        return ItemCommand.priceMessage(id, language)
    }
}
