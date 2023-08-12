import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { THError, getUserLocale, handleInteraction } from "../utils";
import { trpc } from "../trpc";

@Discord()
export abstract class StatsCommand {
  @Slash({
    name: "stats",
    description: "Returns all useful statistics about the specified item",
  })
  async command(
    @SlashOption({
      name: "item",
      description: "Item to get the stats of (start typing to search)",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: async (interaction) => {
        handleInteraction(interaction, async () => {
          const userLocale = getUserLocale(interaction);
          const query = interaction.options.getFocused();
          const results = await trpc.items.search.query({
            query,
            locale: userLocale,
          });
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
        throw new THError(
          "Invalid item name or id. Please use the auto complete feature for accurate searching"
        );
      }

      return {
        content: "⚠️ This Command is Under Construction ⚠️",
        ephemeral: true,
      };
    });
  }
}
