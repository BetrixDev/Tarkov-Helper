import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import {
  embedBuilder,
  handleInteraction,
  s3Image,
  formatPrice,
} from "../utils";
import { trpc } from "../trpc";
import { BITCOIN_ITEM_ID } from "common";

@Discord()
export abstract class BitcoinFarmCommand {
  @Slash({
    name: "bitcoinfarm",
    description:
      "Calculates the amount of bitcoins and profit a day for a bitcoin farm",
  })
  async command(
    @SlashOption({
      name: "gpus",
      description: "The amount of gpus the simulated bitcoin farm will have",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    })
    gpus: number,
    @SlashOption({
      name: "compare",
      description:
        "Use this to display the difference between two different GPU amounts",
      type: ApplicationCommandOptionType.Integer,
    })
    compare: number | undefined,
    interaction: CommandInteraction
  ) {
    handleInteraction(interaction, async () => {
      const btcPrice = await trpc.items.fetchItemData
        .query({
          itemId: BITCOIN_ITEM_ID,
        })
        .then((res) => res.highestSell?.priceRUB!);

      const embed = embedBuilder()
        .setTitle("Bitcoin Farm Calculator")
        .setThumbnail(s3Image("bitcoin"))
        .setDescription(
          "This calculator does not account for any specfial hideout bonuses"
        );

      if (!compare) {
        const farm = new BitcoinFarm(gpus);

        return {
          embeds: [
            embed.setFields(
              {
                name: "Bitcoin Price",
                value: formatPrice(btcPrice),
              },
              {
                name: "Amount of GPUs",
                value: gpus.toString(),
              },
              {
                name: "Bitcoins Per Day",
                value: `₿ ${farm.bitcoinsPerDay}`,
              },
              {
                name: "Roubles Per Day",
                value: formatPrice(farm.rubPerDay(btcPrice)),
              }
            ),
          ],
        };
      } else {
        const farm = new BitcoinFarm(gpus);
        const farm2 = new BitcoinFarm(compare);

        return {
          embeds: [
            embed.setFields(
              {
                name: "Bitcoin Price",
                value: formatPrice(btcPrice),
              },
              {
                name: "Difference in GPUs",
                value: `${Math.abs(farm.gpus - farm2.gpus)} *(${farm.gpus} - ${
                  farm2.gpus
                })*`,
              },
              {
                name: "Difference in Bitcoins Per Day",
                value: `₿ ${farm.bitcoinsPerDay - farm2.bitcoinsPerDay}`,
              },
              {
                name: "Difference in RUB Per Day",
                value: formatPrice(
                  Math.abs(farm.rubPerDay(btcPrice) - farm2.rubPerDay(btcPrice))
                ),
              }
            ),
          ],
        };
      }
    });
  }
}

export class BitcoinFarm {
  gpus: number;

  constructor(gpus: number) {
    this.gpus = gpus;
  }

  get bitcoinsPerDay() {
    // https://escapefromtarkov.fandom.com/wiki/Hideout#Additional_Information
    return (1 / (145000 / (1 + (this.gpus - 1) * 0.041225) / 3600)) * 24;
  }

  rubPerDay(btcPrice: number) {
    return Math.round(this.bitcoinsPerDay * btcPrice);
  }
}
