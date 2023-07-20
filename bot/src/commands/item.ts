import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { trpc } from "../trpc";
import {
  THError,
  embedBuilder,
  getUserLocale,
  handleInteraction,
} from "../utils";

@Discord()
export abstract class ItemCommand {
  @Slash({
    name: "item",
    description: "Get information about any item in the game",
  })
  async command(
    @SlashOption({
      name: "item",
      description:
        "Item to fetch information about (start typing to search for an item)",
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: async (interaction) => {
        handleInteraction(interaction, async () => {
          const query = interaction.options.getFocused();
          const results = await trpc.items.search.query({ query });
          return results.map((r) => ({ name: r.item.name, value: r.item.id }));
        });
      },
    })
    itemInput: string,
    interaction: CommandInteraction
  ) {
    handleInteraction(interaction, async () => {
      const userLocale = getUserLocale(interaction);
      const validInput = await trpc.items.tryItemInput.query({
        query: itemInput,
      });

      if (!validInput) {
        throw new THError("Invalid item name or id");
      }

      const embed = embedBuilder();

      return { content: "⚠️ This command is under construction ⚠️" };
    });
  }
}
