import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { embedBuilder, handleInteraction } from "../utils";
import { trpc } from "../trpc";

@Discord()
export abstract class StatusCommand {
  @Slash({
    name: "status",
    description: "Returns information regarding server status and stability",
  })
  async command(interaction: CommandInteraction) {
    handleInteraction(interaction, async () => {
      const serverStatus = (await trpc.serverStatus.query()).status;

      return {
        embeds: [
          embedBuilder()
            .setTitle(
              `${
                serverStatus.generalStatus.name
              } Status: ${serverStatus.generalStatus.statusCode.replace(
                "OK",
                "Stable"
              )}`
            )
            .addFields(
              serverStatus.currentStatuses.map((s) => {
                return {
                  name: s.name,
                  value: s.statusCode.replace("OK", "Stable"),
                  inline: true,
                };
              })
            ),
        ],
      };
    });
  }
}
