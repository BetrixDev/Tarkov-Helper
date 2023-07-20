import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Slash } from "discordx";
import dayjs from "dayjs";
import { trpc } from "../trpc";
import { embedBuilder, getUserLocale, handleInteraction } from "../utils";

@Discord()
export abstract class RestockCommand {
  @Slash({
    name: "restocks",
    description: "Returns the time left till each trader restocks",
  })
  async command(interaction: CommandInteraction) {
    handleInteraction(interaction, async () => {
      const userLocale = getUserLocale(interaction);

      const traderData = await trpc.traders.restockTimes.query({
        locale: userLocale,
      });

      const embed = embedBuilder()
        .setTitle("Trader Restock Times")
        .setFooter({ text: "Data courtesy of tarkov.dev" })
        .setFields(
          ...traderData.map((trader) => ({
            name: trader.name,
            value: `<t:${dayjs(trader.resetTime).unix()}:R>`,
            inline: true,
          }))
        );

      return { embeds: [embed] };
    });
  }
}
