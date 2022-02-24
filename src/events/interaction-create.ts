import 'reflect-metadata'
import { ArgsOf, Client, Discord, On } from 'discordx'
import logger from '../config/logger'

const Namespace = 'InteractionCreate'

@Discord()
export class InteractionCreateEvent {
    @On('interactionCreate')
    async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client) {
        if (interaction.isCommand()) {
            logger.info(
                Namespace,
                `New command interaction (${interaction.commandName})`,
                interaction.options.data.map((a) => ({ name: a.name, value: a.value }))
            )

            client.executeInteraction(interaction)
        } else if (interaction.isAutocomplete()) {
            logger.info(
                Namespace,
                `New auto complete interaction (${interaction.commandName})`,
                interaction.options.data.map((a) => ({ name: a.name, value: a.value }))
            )

            client.executeInteraction(interaction)
        } else if (interaction.isMessageComponent()) {
            client.executeInteraction(interaction)
        }
    }
}
