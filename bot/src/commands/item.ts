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

      const itemData = await trpc.items.fetchItemData.query({
        itemId: validInput,
        locale: userLocale,
      });

      const embed = embedBuilder()
        .setTitle(
          `${itemData.shortName} Information - ${
            itemData.canSellOnFlea
              ? formatPrice(itemData.avg24hFleaPrice, { locale: userLocale })
              : "[BANNED ON FLEA]"
          }`
        )
        .setThumbnail(itemData.iconLink);

      return { embeds: [embed] };
    });
  }
}
