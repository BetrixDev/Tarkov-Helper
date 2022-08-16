import "reflect-metadata";
import { ArgsOf, Client, Discord, On } from "discordx";
import logger from "../../logger";

const NAMESPACE = "InteractionCreate";

@Discord()
export class InteractionCreate {
    @On("interactionCreate")
    async event([interaction]: ArgsOf<"interactionCreate">, client: Client): Promise<void> {
        if (interaction.isCommand()) {
            logger.info(
                NAMESPACE,
                `New command interaction (${interaction.commandName}) (${interaction.locale})`,
                interaction.options.data.map((a) => ({ name: a.name, value: a.value }))
            );

            client.executeInteraction(interaction);
        } else if (interaction.isAutocomplete()) {
            logger.info(
                NAMESPACE,
                `New auto complete interaction (${interaction.commandName}) (${interaction.locale})`,
                interaction.options.data.map((a) => ({ name: a.name, value: a.value }))
            );

            client.executeInteraction(interaction);
        } else if (interaction.isMessageComponent()) {
            logger.info(
                NAMESPACE,
                `New message component interaction (${interaction.customId}) (${interaction.locale})`
            );

            client.executeInteraction(interaction);
        }
    }
}
