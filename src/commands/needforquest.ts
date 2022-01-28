import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { ErrorReponse, isID } from '../lib'
import SearchEngine from '../helpers/search_engines/item-engine'

@Discord()
export class NeedforQuestCommand {
    @Slash('needforquest', {
        description: 'Shows if the specified item is needed for quests and how'
    })
    async quest(
        @SlashOption('item', {
            description: 'Item to show dependencies for',
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
                interaction.reply(
                    ErrorReponse('Please use the auto complete function to complete your search', interaction)
                )
                return
            }

            interaction.reply(this.message())
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(): InteractionReplyOptions {
        return { content: 'Please use the /item command to access quest dependents for this item', ephemeral: true }
    }
}
