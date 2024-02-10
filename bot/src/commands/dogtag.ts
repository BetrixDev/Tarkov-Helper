import {
  ApplicationCommandOptionType,
  CommandInteraction,
  InteractionReplyOptions,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { SupportedLocale, USEC_DOGTAG_ITEM_ID } from "common";
import {
  embedBuilder,
  formatPrice,
  getUserLocale,
  handleInteraction,
} from "../utils.js";
import { trpc } from "../trpc.js";

@Discord()
export abstract class DogtagCommand {
  @Slash({
    name: "dogtag",
    nameLocalizations: {
      "en-US": "dogtag",
    },
    description: "Calculate the selling price of a dogtag based on its level",
    descriptionLocalizations: {
      "en-US": "Calculate the selling price of a dogtag based on its level",
    },
  })
  async command(
    @SlashOption({
      name: "level",
      description: "Level of the dogtag",
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      maxValue: 79,
      required: true,
    })
    level: number,
    interaction: CommandInteraction
  ) {
    const userLocale = getUserLocale(interaction);

    handleInteraction(interaction, () => dogtagCommand(level, userLocale));
  }
}

async function dogtagCommand(
  level: number,
  locale: SupportedLocale
): Promise<InteractionReplyOptions> {
  const dogtag = await trpc.items.fetchItemData.query({
    locale,
    itemId: USEC_DOGTAG_ITEM_ID,
  });

  const pricePerLevel = dogtag.highestSell!.priceRUB;

  const sellingPrice = formatPrice(pricePerLevel * level);

  const embed = embedBuilder()
    .setTitle("Dogtag Price")
    .setThumbnail(dogtag.iconLink)
    .setFields(
      {
        name: "Dogtag Level",
        value: level.toString(),
      },
      {
        name: "Dogtag Price",
        value: sellingPrice,
      }
    );

  return { embeds: [embed] };
}
