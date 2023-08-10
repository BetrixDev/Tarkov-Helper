import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { trpc } from "../trpc";
import {
  THError,
  embedBuilder,
  formatNumber,
  formatPrice,
  getUserLocale,
  handleInteraction,
} from "../utils";

@Discord()
export abstract class NeedForQuestCommand {
  @Slash({
    name: "needforquest",
    description:
      "Returns how many of the specified item is needed for what quests and in what state",
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
        throw new THError(
          "Invalid item name or id. Please use the auto complete feature for accurate searching"
        );
      }

      const [data, item] = await Promise.all([
        trpc.items.needForQuest.query({
          locale: userLocale,
          itemId: validInput,
        }),

        trpc.items.fetchItemData.query({
          locale: userLocale,
          itemId: validInput,
        }),
      ]);

      const embed = embedBuilder()
        .setTitle(`Quest dependencies for ${item.shortName}`)
        .setThumbnail(item.iconLink)
        .setDescription(
          `
        [Wiki Link](${item.wikiLink})
        ${item.shortName} is needed for the following quests:
        ${data.quests
          .map((q) => `**${q.name}** *(${formatNumber(q.amount)})*`)
          .join("\n")}
      `
        )
        .setFields(
          {
            name: "Found in Raid",
            value: formatNumber(data.foundInRaid),
            inline: true,
          },
          {
            name: "Non FIR",
            value: formatNumber(data.nonFir),
            inline: true,
          },
          {
            name: "Amount to Place",
            value: formatNumber(data.place),
            inline: true,
          }
        );

      return {
        embeds: [embed],
      };
    });
  }
}
