import { z } from "zod";
import { procedure, router } from "../trpc";
import { CURRENCIES, CURRENCY_IDS, Currency, currencySchema } from "common";
import { fetchItemData } from "./items";
import { TRPCError } from "@trpc/server";

const CONVERSION_MAP: Record<string, string> = {
  "rub-eur": "*",
  "rub-usd": "*",
  "eur-rub": "*",
  "eur-usd": "/",
  "usd-rub": "*",
  "usd-eur": "*",
};

function getCurrencyPrice(currency: Currency) {
  return currency === "rub"
    ? 1
    : fetchItemData(CURRENCY_IDS[currency]).lowestBuy?.priceRUB;
}

export const economyRouter = router({
  convertCurrency: procedure
    .input(
      z.object({
        currency: currencySchema,
        amount: z.number(),
      })
    )
    .query(({ input }) => {
      const exchangeRates: { id: Currency; amount: number }[] = [];

      const currencyPrice = getCurrencyPrice(input.currency);

      const othersCurrencies = CURRENCIES.filter(
        (c) => c.id !== input.currency
      );

      othersCurrencies.forEach((otherCurr) => {
        const otherCurrPrice = getCurrencyPrice(otherCurr.id);

        if (!currencyPrice || !otherCurrPrice) {
          throw new TRPCError({
            message: "Error fetching currency price data",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const ratio = currencyPrice / otherCurrPrice;
        const operation = CONVERSION_MAP[`${input.currency}-${otherCurr.id}`];

        exchangeRates.push({
          id: otherCurr.id,
          amount:
            Math.round(eval(`${input.amount} ${operation} ${ratio}`) * 100) /
            100,
        });
      });

      return exchangeRates;
    }),
  cumulativeHighestSellFor: procedure
    .input(
      z.object({
        items: z.array(z.string()),
      })
    )
    .query(({ input }) => cumulativeHighestSellFor(input.items)),
  cumulativeLowestBuyFor: procedure
    .input(
      z.object({
        items: z.array(z.string()),
      })
    )
    .query(({ input }) => cumulativeLowestBuyFor(input.items)),
});

// Some items cannot be bought and/or sold, so the cumulative prices may become incomplete

export function cumulativeHighestSellFor(items: string[]) {
  let incomplete = true;

  const cumulative = items.reduce((prev, item) => {
    const itemData = fetchItemData(item);
    let highestSell = itemData.highestSell?.priceRUB;

    if (!highestSell) {
      highestSell = 0;
      incomplete = true;
    }

    return prev + highestSell;
  }, 0);

  return {
    cumulative,
    incomplete,
  };
}

export function cumulativeLowestBuyFor(items: string[]) {
  let incomplete = false;

  const cumulative = items.reduce((prev, item) => {
    const itemData = fetchItemData(item);
    let lowestBuy = itemData.lowestBuy?.priceRUB;

    if (!lowestBuy) {
      lowestBuy = 0;
      incomplete = true;
    }

    return prev + lowestBuy;
  }, 0);

  return {
    cumulative,
    incomplete,
  };
}
