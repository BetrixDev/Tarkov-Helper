import { z } from "zod";

export const CURRENCIES = [
  {
    id: "rub",
    gameId: "5449016a4bdc2d6f028b456f",
    name: "Roubles",
  },
  {
    id: "eur",
    gameId: "569668774bdc2da2298b4568",
    name: "Euros",
  },
  {
    id: "usd",
    gameId: "5696686a4bdc2da3298b456a",
    name: "Dollars",
  },
] as const;

export const CURRENCY_IDS: Record<Currency, string> = {
  rub: "5449016a4bdc2d6f028b456f",
  usd: "5696686a4bdc2da3298b456a",
  eur: "569668774bdc2da2298b4568",
};

export const currencySchema = z.union([
  z.literal("rub"),
  z.literal("usd"),
  z.literal("eur"),
]);

export type Currency = z.infer<typeof currencySchema>;
