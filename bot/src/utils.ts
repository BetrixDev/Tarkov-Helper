import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  BaseInteraction,
  CommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  MessageComponentInteraction,
} from "discord.js";
import { localesSchema, SupportedLocale } from "common";
import { logger } from "./log";

/** Attempts to match the user's selected locale to a supported locale else defaults to "en" */
export function getUserLocale(interaction: BaseInteraction): SupportedLocale {
  const userLocale = interaction.locale;

  const supportedLocale = localesSchema.safeParse(userLocale);

  if (!supportedLocale.success) {
    return "en";
  }

  return supportedLocale.data;
}

export const formatPrice = new Intl.NumberFormat("en-US").format;

export const embedBuilder = () => new EmbedBuilder().setColor("#101720");

const errorEmbedBuilder = (description: string, commandName?: string) =>
  new EmbedBuilder()
    .setAuthor({ name: "Tarkov Helper" })
    .setColor("#ff2424")
    .setTitle("The command issued had an error")
    .setDescription(`\`${description}\``)
    .setFooter(commandName ? { text: `Command issued ${commandName}` } : null);

export class THError extends Error {
  name = "therror";
  meta?: Record<string, string>;

  constructor(message: string, meta?: Record<string, string>) {
    super(message);
    this.meta = meta;
  }
}

export async function handleInteraction<
  I extends
    | CommandInteraction
    | MessageComponentInteraction
    | AutocompleteInteraction
>(
  interaction: I,
  messageFunc: () => Promise<
    I extends CommandInteraction
      ? InteractionReplyOptions
      : I extends MessageComponentInteraction
      ? InteractionUpdateOptions | InteractionReplyOptions
      : ApplicationCommandOptionChoiceData<string>[]
  >
) {
  const start = Date.now();

  try {
    if (interaction.isCommand()) {
      const msg = (await messageFunc()) as InteractionReplyOptions;

      await interaction.reply(msg);
    } else if (interaction.isMessageComponent()) {
      const msg = (await messageFunc()) as InteractionUpdateOptions;

      await interaction.update(msg);
    } else if (interaction.isAutocomplete()) {
      const results =
        (await messageFunc()) as ApplicationCommandOptionChoiceData<string>[];

      await interaction.respond(results);
    }

    logger.info("Successfully responded to interaction", {
      id: interaction.id,
      elapsedMs: Date.now() - start,
    });
  } catch (e: any) {
    if (e.name && e.name === "therror") {
      // Error is meant to be displayed to the user
      const error = e as THError;

      if (interaction.isCommand()) {
        const args = interaction.options.data.map(
          (arg) => `${arg.name}: ${arg.value ?? "*undefined*"}`
        );

        interaction.reply({
          ephemeral: true,
          embeds: [
            errorEmbedBuilder(error.message, interaction.commandName).setFields(
              {
                name: "Args",
                value: args.length > 0 ? args.join("\n") : "none",
              }
            ),
          ],
        });
      } else if (interaction.isMessageComponent()) {
        interaction.reply({
          ephemeral: true,
          embeds: [errorEmbedBuilder(error.message)],
        });
      }

      logger.info("Interaction ejected during execution", {
        id: interaction.id,
        args: interaction.isCommand() ? interaction.options.data : undefined,
        elapsedMs: Date.now() - start,
        ...error.meta,
      });
    } else {
      // Internal unexpected error occurred
      logger.error(
        "Unexpected error occurred attempting to respond to interaction",
        {
          id: interaction.id,
          elapsedMs: Date.now() - start,
          error: e,
        }
      );

      if (!interaction.isAutocomplete()) {
        interaction.reply({
          ephemeral: true,
          embeds: [
            errorEmbedBuilder(
              "An unknown error occurred when attempting to respond"
            ),
          ],
        });
      }
    }
  }
}

export function t(locale: SupportedLocale) {}
