import { InteractionType } from "discord.js";
import { ArgsOf, Client, Discord, On, Once } from "discordx";
import { logger } from "./log";

const APPLICATION_COMMAND_MAP = {
  [InteractionType.ApplicationCommand]: "app-command",
  [InteractionType.MessageComponent]: "message-component",
  [InteractionType.ApplicationCommandAutocomplete]: "auto-complete",
  [InteractionType.ModalSubmit]: "modal-submit",
};

@Discord()
export abstract class ClientEvents {
  @Once({ event: "ready" })
  async onceReady(_: ArgsOf<"ready">, client: Client) {
    logger.info("Tarkov Helper started");

    await client.guilds.fetch();
    await client.initApplicationCommands();
  }

  @On({ event: "interactionCreate" })
  onInteractionCreate(
    [interaction]: ArgsOf<"interactionCreate">,
    client: Client
  ) {
    logger.info("New interaction created", {
      event: "inteactionCreate",
      id: interaction.id,
      type: APPLICATION_COMMAND_MAP[interaction.type],
      name: interaction.isCommand() ? interaction.commandName : undefined,
      args: interaction.isCommand() ? interaction.options.data : undefined,
      autoInput: interaction.isAutocomplete()
        ? interaction.options.getFocused()
        : undefined,
      customId: interaction.isMessageComponent()
        ? interaction.customId
        : undefined,
    });

    client.executeInteraction(interaction);
  }

  @On({ event: "guildCreate" })
  async onGuildCreate(_: ArgsOf<"guildCreate">, client: Client) {
    const guilds = await client.guilds.fetch();

    logger.info("Added to a server", {
      event: "guildCreate",
      newTotal: guilds.size,
    });
  }

  @On({ event: "guildDelete" })
  async onGuildDelete(_: ArgsOf<"guildDelete">, client: Client) {
    const guilds = await client.guilds.fetch();

    logger.info("Removed from a server", {
      event: "guildDelete",
      newTotal: guilds.size,
    });
  }
}
