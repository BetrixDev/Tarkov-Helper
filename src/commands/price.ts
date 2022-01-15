import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import SearchEngine from '../helpers/search_engines/item-engine'
import { ErrorReponse, isID, isShortName } from '../lib'

@Discord()
export abstract class PriceCommand {
    @Slash('price', { description: 'Returns price info of a specified item' })
    price(
        @SlashOption('item', {
            description: 'item to lookup (start typing to search)',
            required: true,
            autocomplete: (interaction: AutocompleteInteraction) => {
                const input = interaction.options.getFocused(true)

                const results = SearchEngine(input.value.toString())

                interaction.respond(
                    results.map((result) => {
                        return { name: result.item.name, value: result.item.id }
                    })
                )
            },
            type: 'STRING'
        })
        id: string,
        interaction: CommandInteraction
    ) {
        try {
            if (!isID(id)) {
                const isShort = isShortName(id)
                if (isShort) {
                    id = isShort.id
                } else {
                    interaction.reply(
                        ErrorReponse('Please use the auto complete function to complete your search', interaction)
                    )
                    return
                }
            }
            interaction.reply(this.message())
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(): InteractionReplyOptions {
        return { content: 'Please use the /item command to access price data for this item', ephemeral: true }
    }
}
