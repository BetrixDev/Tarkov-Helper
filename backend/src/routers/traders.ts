import { z } from "zod";
import { procedure, router } from "../trpc";
import { SupportLocale, localesSchema } from "common";
import { get } from "../cache";
import { tarkovDev } from "../gql/client";

export const fetchTraderData = (
  traderIdOrName: string,
  locale: SupportLocale
) => {
  const traderData = get("traders").find(
    (t) => t.id === traderIdOrName || t.normalizedName === traderIdOrName
  )!;

  const localeData = get(`locale-${locale}`);

  return {
    id: traderData.id,
    nickName: localeData[`${traderData.id} Nickname`],
    firstName: localeData[`${traderData.id} FirstName`],
    lastName: localeData[`${traderData.id} LastName`],
    description: localeData[`${traderData.id} Description`],
  };
};

export const tradersRouter = router({
  restockTimes: procedure
    .input(z.object({ locale: localesSchema }))
    .query(async ({ input }) => {
      const localeData = get(`locale-${input.locale}`);

      const traderData = await tarkovDev.traderRestocks();

      return traderData.traders.map((trader) => {
        return {
          name: localeData[`${trader.id} Nickname`],
          resetTime: trader.resetTime,
        };
      });
    }),
  fetchTraderData: procedure
    .input(z.object({ locale: localesSchema, traderIdOrName: z.string() }))
    .query(({ input }) => {
      return fetchTraderData(input.traderIdOrName, input.locale);
    }),
});
