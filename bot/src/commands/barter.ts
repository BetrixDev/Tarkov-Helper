import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedField,
  InteractionReplyOptions,
} from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import { trpc } from "../trpc";
import { EMTPY_EMBED_FIELD, SupportLocale, ZERO_WIDTH } from "common";
import {
  embedBuilder,
  formatPrice,
  getUserLocale,
  handleInteraction,
} from "../utils";

@Discord()
export abstract class BarterCommand {
  @Slash({
    name: "barter",
    description: "Calculates the price and profit of the specified barter",
  })
  async commandHandler(
    @SlashOption({
      name: "item",
      description: "Item to get barter info of (start typing to search)",
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
    const userLocale = getUserLocale(interaction);

    handleInteraction(interaction, () => this.command(itemInput, userLocale));
  }

  @ButtonComponent({ id: /barter__(b|f)__(.*)__[0-9]+/ })
  async button(interaction: ButtonInteraction) {
    handleInteraction(interaction, () => {
      const [, action, id, p] = interaction.customId.split("__");
      const page = Number(p);
      const userLocale = getUserLocale(interaction);

      if (action === "b") {
        return this.command(id, userLocale, page - 1);
      } else {
        return this.command(id, userLocale, page + 1);
      }
    });
  }

  async command(
    itemId: string,
    locale: SupportLocale,
    page = 0
  ): Promise<InteractionReplyOptions> {
    const validInput = await trpc.items.tryItemInput.query({
      query: itemId,
    });

    itemId = validInput;

    if (!validInput) {
      return {
        content: "invalid item name or id",
        ephemeral: true,
      };
    }

    const [item, barters, bartersUsingItem] = await Promise.all([
      trpc.items.fetchItemData.query({
        itemId,
        locale,
      }),
      await trpc.barters.fromRewardItem.query({
        itemId,
        locale,
      }),
      trpc.barters.fromRequiredItem.query({
        itemId,
        locale,
      }),
    ]);

    const pages = barters.length;
    const fields: EmbedField[] = [];

    if (bartersUsingItem.length === 0) {
      fields.push({
        name: "Used in barters",
        value: "None",
        inline: true,
      });
    } else {
      fields.push({
        name: "Used in barters",
        value: bartersUsingItem
          .map(
            (b) =>
              `**x${
                b.requiredItems.find((i) => i.item.id === itemId)!.count
              }** in ${b.reward.shortName} *(${formatPrice(b.barterCost)})*`
          )
          .join("\n"),
        inline: true,
      });
    }

    // fill up the first row of the embed fields to keep everything aligned
    fields.push(EMTPY_EMBED_FIELD());
    fields.push(EMTPY_EMBED_FIELD());

    if (pages === 0) {
      return {
        embeds: [
          embedBuilder()
            .setThumbnail(item.iconLink)
            .setTitle(`${item.shortName} Barters`)
            .setDescription(
              `[Wiki Link](${item.wikiLink})\nThis item has no barters`
            )
            .setFields(fields),
        ],
      };
    }

    return {
      embeds: [
        embedBuilder()
          .setThumbnail(item.iconLink)
          .setTitle(`${item.shortName} Barters`)
          .setDescription(`[Wiki Link](${item.wikiLink})`)
          .setFields(...generateBarterEmbeds(barters[page])),
      ],
      components:
        pages !== 1
          ? [
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId(`barter__b__${itemId}__${page}`)
                  .setLabel("Last Barter")
                  .setDisabled(page === 0) // disable button if on the first page
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("no_id")
                  .setLabel(`${page + 1} / ${pages}`)
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId(`barter__f__${itemId}__${page}`)
                  .setLabel("Next Barter")
                  .setDisabled(page === pages - 1) // disable button if on the last page
                  .setStyle(ButtonStyle.Primary)
              ),
            ]
          : [],
    };
  }
}

type BarterData = Awaited<
  ReturnType<typeof trpc.barters.fromRequiredItem.query>
>[number];

function generateBarterEmbeds(barterData: BarterData): EmbedField[] {
  const isBarterTotalComplete = barterData.requiredItems.every(
    ({ item }) => item.lowestBuy !== undefined
  );

  const barterItems = barterData.requiredItems.map(
    ({ count, item }) =>
      `x**${count}** - [${item.shortName}](${item.wikiLink} "${
        item.name
      }" ) - ${
        item.lowestBuy !== undefined
          ? formatPrice(item.lowestBuy!.priceRUB)
          : "Can't buy"
      }`
  );

  const barterReward = barterData.reward;
  const itemBuyPrice = barterReward.lowestBuy;

  return [
    {
      name: `${barterData.traderData.name} LL${barterData.traderData.level} Barter`,
      value: ZERO_WIDTH,
      inline: true,
    },
    EMTPY_EMBED_FIELD(),
    EMTPY_EMBED_FIELD(),
    {
      name: "Items",
      value: barterItems.join("\n"),
      inline: true,
    },
    EMTPY_EMBED_FIELD(),
    {
      name: "Flea Market Price",
      value: barterReward.canSellOnFlea
        ? formatPrice(barterReward.avg24hFleaPrice)
        : "Can't be bought on market",
      inline: true,
    },
    {
      name: "Barter Total",
      value: isBarterTotalComplete
        ? formatPrice(barterData.barterCost)
        : `${formatPrice(barterData.barterCost)} *(Incomplete price)*`,
      inline: true,
    },
    EMTPY_EMBED_FIELD(),
    {
      name: "Barter Profit",
      value:
        itemBuyPrice !== undefined
          ? formatPrice(itemBuyPrice.priceRUB - barterData.barterCost)
          : "Can't calculate",
      inline: true,
    },
  ];
}
