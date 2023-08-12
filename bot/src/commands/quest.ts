import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { THError, getUserLocale, handleInteraction } from "../utils";
import { trpc } from "../trpc";

@Discord()
export abstract class QuestCommand {
  @Slash({
    name: "quest",
    description: "Retrieves information about a quest and how to complete it",
  })
  async command(
    @SlashOption({
      name: "quest",
      description: "Name of the quest (start typing to search)",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: async (interaction) => {
        handleInteraction(interaction, async () => {
          const userLocale = getUserLocale(interaction);
          const query = interaction.options.getFocused();
          const results = await trpc.quests.search.query({
            query,
            locale: userLocale,
          });
          return results.map((r) => ({
            name: r.item.name,
            value: r.item.id.toString(),
          }));
        });
      },
    })
    questInput: string,
    interaction: CommandInteraction
  ) {
    handleInteraction(interaction, async () => {
      const validInput = await trpc.quests.tryQuestInput.query({
        query: questInput,
      });

      if (!validInput) {
        throw new THError(
          "Invalid quest input. Please use the auto complete feature for accurate searching"
        );
      }

      return { content: validInput };
    });
  }
}
