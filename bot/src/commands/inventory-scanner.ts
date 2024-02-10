import {
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import { ContextMenu, Discord } from "discordx";
import { trpc } from "../trpc.js";

@Discord()
export abstract class InventoryScanner {
  @ContextMenu({
    name: "Scan Item Prices",
    type: ApplicationCommandType.Message,
  })
  async scanInventory(interaction: MessageContextMenuCommandInteraction) {
    const image = interaction.targetMessage.attachments.at(0);

    if (image === undefined) {
      return interaction.reply({
        content: "There was no image attached to the messsage to scan",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Scanning image for valid items...",
        ephemeral: true,
      });
    }

    const response = await trpc.items.scan.query({ imageUrl: image.url });

    await interaction.editReply({ content: JSON.stringify(response, null, 2) });
  }
}
