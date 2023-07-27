import {
  ApplicationCommandOptionType,
  CommandInteraction,
  InteractionReplyOptions,
} from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { trpc } from "../trpc";
import {
  THError,
  embedBuilder,
  formatPrice,
  handleInteraction,
  s3Image,
} from "../utils";
import { CURRENCIES } from "common";

type Currency = (typeof CURRENCIES)[number]["id"];

@Discord()
export abstract class ExchangeRateCommand {
  @Slash({
    name: "exchangerate",
    description: "Convert a currency to the others",
  })
  async command(
    @SlashChoice(...CURRENCIES.map((c) => ({ name: c.name, value: c.id })))
    @SlashOption({
      name: "currency",
      description: "Currency to convert",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    currency: Currency,
    @SlashOption({
      name: "amount",
      description: "Amount of the currency",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      minValue: 1,
    })
    amount: number,
    interaction: CommandInteraction
  ) {
    handleInteraction(interaction, async () => command(currency, amount));
  }
}

export async function command(
  currency: Currency,
  amount: number
): Promise<InteractionReplyOptions> {
  const exchangeData = await trpc.economy.convertCurrency.query({
    amount,
    currency,
  });

  const currencyName = CURRENCIES.find((c) => c.id === currency)!.name;

  const embed = embedBuilder()
    .setTitle(`Currency Conversions for ${formatPrice(amount, { currency })}`)
    .setThumbnail(s3Image("exchange-rate"))
    .setDescription(
      `Below will show the value of ${currencyName} in the other currencies`
    )
    .setFields({
      name: "Conversions",
      value: exchangeData
        .map((e) => {
          const currencyName = CURRENCIES.find((c) => c.id === e.id)!.name;

          return `**${currencyName}**: ${formatPrice(e.amount, {
            currency: e.id,
          })}`;
        })
        .join("\n"),
    });

  return {
    embeds: [embed],
  };
}
