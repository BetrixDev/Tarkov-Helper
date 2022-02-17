import 'reflect-metadata'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { ArgsOf, Client, Discord, On } from 'discordx'
import { container, injectable } from 'tsyringe'
import { ServerDatabase } from '../database/server'
import { ErrorReponse } from '../lib'
import logger from '../config/logger'

const Namespace = 'InteractionCreate'

@Discord()
@injectable()
export class InteractionCreateEvent {
    constructor(private _servers: ServerDatabase) {}

    @On('interactionCreate')
    async interactionCreate([interaction]: ArgsOf<'interactionCreate'>, client: Client) {
        if (interaction.isCommand()) {
            // Custom method for commands to inject ServerData into the args
            this.handleCommand(interaction, client)
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

    async handleCommand(interaction: CommandInteraction, client: Client): Promise<void> {
        logger.info(
            Namespace,
            `New command interaction (${interaction.commandName})`,
            interaction.options.data.map((a) => ({ name: a.name, value: a.value }))
        )

        // https://github.com/oceanroleplay/discord.ts/blob/8e0d4070a3d9e561c57b14c3334f08952da07000/packages/discordx/src/Client.ts#L1039
        const tree = client.getApplicationCommandGroupTree(interaction)
        const command = client.getApplicationCommandFromTree(tree)

        if (!command) {
            logger.error(Namespace, `Error grabbing ${interaction.commandName} class`)
            return
        }

        // Retrieve serverData from the database
        const db = container.resolve(InteractionCreateEvent)
        const serverData = await db._servers.query(interaction.guildId ?? '')

        command
            .execute([], interaction, client, serverData)
            .then((r) => {
                const response = r as InteractionReplyOptions
                interaction.reply(response)
            })
            .catch((r) => {
                // Not all errors are actual errors from the code but instead are errors thrown by the commands for lacking permissions, invalid item, etc.
                logger.warn(Namespace, 'Error executing command', r)
                interaction.reply(ErrorReponse(r, interaction, serverData.Language))
            })
    }
}
