import "reflect-metadata";
import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
export class InteractionCreate {
    @On("interactionCreate")
    async event([interaction]: ArgsOf<"interactionCreate">, client: Client): Promise<void> {
        client.executeInteraction(interaction);
    }
}
