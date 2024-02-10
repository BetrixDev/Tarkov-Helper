import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import {
  THError,
  getUserLocale,
  handleInteraction,
  embedBuilder,
} from "../utils.js";
import { Table } from "embed-table";
import { trpc } from "../trpc.js";
import assert from "assert";

@Discord()
export abstract class CaliberCommand {
  @Slash({
    name: "caliber",
    description: "Returns the stats for every bullet in the specified caliber",
  })
  async command(
    @SlashOption({
      name: "caliber",
      description: "Name of the caliber (start typing to search)",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: (interaction) => {
        handleInteraction(interaction, async () => {
          const query = interaction.options.getFocused();
          const results = await trpc.items.searchCalibers.query({ query });
          return results.map((r) => ({ name: r.item.name, value: r.item.id }));
        });
      },
    })
    caliberInput: string,
    interaction: CommandInteraction
  ) {
    handleInteraction(interaction, async () => {
      const userLocale = getUserLocale(interaction);

      const bullets = await trpc.items.fetchCaliberData.query({
        caliberId: caliberInput,
        locale: userLocale,
      });

      if (bullets.length === 0) {
        throw new THError(
          "Invalid search term, please use the auto-complete feature to search for a caliber"
        );
      }

      const table = new Table({
        titles: ["Name", "Penetration", "Damage"],
        titleIndexes: [0, 14, 28],
        columnIndexes: [0, 14, 28],
        start: "`",
        end: "`",
        padEnd: 3,
      });

      bullets.forEach((bullet) => {
        assert(bullet.properties.__typename === "ItemPropertiesAmmo");

        table.addRow([
          bullet.shortName,
          bullet.properties.penetrationPower.toString(),
          bullet.properties.damage.toString(),
        ]);
      });

      const embed = embedBuilder()
        .setTitle(`Caliber data for ${caliberInput.replace("Caliber", "")}`)
        .setFields(table.toField());

      return { embeds: [embed] };
    });
  }
}
