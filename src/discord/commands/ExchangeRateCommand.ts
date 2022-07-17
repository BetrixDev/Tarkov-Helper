import "reflect-metadata";
import { CommandInteraction, InteractionReplyOptions } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { BaseCommand } from "../../lib/BaseCommand";
import { LanguageCode } from "../../../types/common";
import { Item } from "../../lib/models/Item";
import { translation } from "../../lib/util/translation";
import { config } from "../../config";

const COMMAND_NAME = "exchangerate";

const CURRENCIES: readonly CurrencyData[] = [
    {
        id: "rub",
        gameId: "5449016a4bdc2d6f028b456f",
        name: "Roubles"
    },
    {
        id: "eur",
        gameId: "569668774bdc2da2298b4568",
        name: "Euros"
    },
    {
        id: "usd",
        gameId: "5696686a4bdc2da3298b456a",
        name: "Dollars"
    }
] as const;

interface CurrencyData {
    id: string;
    gameId: string;
    name: string;
}
type Currency = typeof CURRENCIES[number]["id"];
type ExchangeRateData = Record<Currency, { ratio: number; operation: "*" | "/" }>;

function formatPrice(currency: string, price: number) {
    return new Intl.NumberFormat("en-EN", {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumSignificantDigits: 6
    })
        .format(Number(price))
        .replace("RUB", "₽")
        .replace(" ", "");
}

@Discord()
export class ExchangeRateCommand extends BaseCommand {
    @Slash(COMMAND_NAME, BaseCommand.resolveCommandOptions(COMMAND_NAME))
    exchangeRate(
        @SlashChoice({ name: "Roubles", value: "rub" })
        @SlashChoice({ name: "Dollars", value: "usd" })
        @SlashChoice({ name: "Euros", value: "eur" })
        @SlashOption("currency", BaseCommand.resolveOptions(COMMAND_NAME, "currency", { type: "STRING" }))
        currency: Currency,
        @SlashOption("amount", BaseCommand.resolveOptions(COMMAND_NAME, "amount", { type: "INTEGER" }))
        amount: number,
        interaction: CommandInteraction
    ): void {
        this.handleCommandInteraction(
            interaction,
            new Promise((resolve, reject) => {
                resolve(this.command(currency, amount, this.getLanguage(interaction)));
            })
        );
    }

    command(currency: Currency, amount: number, language: LanguageCode): InteractionReplyOptions {
        const t = translation(language);
        const conversionData = this.getConversionData(currency);

        const conversions = Object.entries(conversionData).map(([currencyId, data]) => {
            const currencyData = CURRENCIES.find((c) => c.id === currencyId) as CurrencyData;

            return `**${t(currencyData.name)}**: ${formatPrice(
                currencyId,
                Math.round(eval(`${amount} ${data.operation} ${data.ratio}`) * 100) / 100
            )}`;
        });

        const currencyData = CURRENCIES.find((c) => c.id === currency) as CurrencyData;

        return {
            embeds: [
                this.createEmbed()
                    .setTitle(t("Currency Conversions for {0}", formatPrice(currency, amount)))
                    .setThumbnail(config.bot.images.exchangeRate)
                    .setDescription(
                        `*${t("Below will show the value of {0} in other currencies", t(currencyData.name))}*`
                    )
                    .addFields({
                        name: t("Conversions"),
                        value: conversions.join("\n")
                    })
            ]
        };
    }

    getConversionData(currency: Currency): ExchangeRateData {
        const conversionData = CURRENCIES.map((currency) => {
            const currencyPrice = new Item(currency.gameId).buyingPrice()?.priceRUB;

            const otherCurrencies = CURRENCIES.filter((c) => c.id !== currency.id);

            const data: Partial<ExchangeRateData> = {};

            otherCurrencies.forEach((c) => {
                const price = new Item(c.gameId).buyingPrice()?.priceRUB;

                if (!price || !currencyPrice) {
                    throw new Error("Error getting currency price data");
                }

                // all conversions from rub are division
                // all conversions from usd are multiplication
                // and for eur, the rouble conversion is multiplication and the usd conversion is division
                const operation =
                    currency.id === "rub" ? "/" : currency.id === "usd" ? "*" : c.id === "rub" ? "*" : "/";

                data[c.id] = {
                    operation,
                    ratio: currencyPrice / price
                };
            });

            return data;
        });

        // since the conversion data for each currency doesn't include the conversion for itself, we can find the object that doesn't include data for the currency passed in
        return conversionData.find((c) => c[currency] === undefined) as ExchangeRateData;
    }
}
