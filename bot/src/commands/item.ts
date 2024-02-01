import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { trpc } from "../trpc";
import {
  THError,
  embedBuilder,
  formatPrice,
  getUserLocale,
  handleInteraction,
} from "../utils";
import { statsCommandMessage } from "./stats";

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
      return statsCommandMessage(itemInput, interaction);
    });
  }
}
