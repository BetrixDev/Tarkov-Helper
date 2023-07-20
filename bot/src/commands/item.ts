import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { trpc } from "../trpc";
import { getUserLocale } from "../utils";

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
        const query = interaction.options.getFocused();

        const results = await trpc.items.search.query({ query });

        interaction.respond(
          results.map((r) => ({ name: r.item.name, value: r.item.id }))
        );
      },
    })
    itemInput: string,
    interaction: CommandInteraction
  ) {
    const userLocale = getUserLocale(interaction);
    const validInput = await trpc.items.tryItemInput.query({
      query: itemInput,
    });

    if (!validInput) {
      interaction.reply({
        content: "invalid item name or id",
        ephemeral: true,
      });
      return;
    }

    interaction.reply({ content: "⚠️ This command is under construction ⚠️" });
  }
}
