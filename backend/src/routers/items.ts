import z from "zod";
import { get } from "../cache";
import { procedure, router } from "../trpc";
import { searchCatagory } from "../search-engines";
import { SupportLocale, localesSchema } from "common";
import { fetchTraderData } from "./traders";
import { AllQuery } from "../gql/generated";

const formatBuySellFor = (
  obj: AllQuery["items"][number]["buyFor"],
  locale: SupportLocale
) => {
  return obj.map((s) => {
    const traderData = fetchTraderData(s.vendor.normalizedName, locale);

    return {
      price: s.price,
      priceRUB: s.priceRUB,
      traderId: traderData.id,
      traderNickName: traderData.nickName,
    };
  });
};

export const itemsRouter = router({
  search: procedure
    .input(
      z.object({
        query: z.string(),
        maxResults: z.number().default(25),
        locale: localesSchema,
      })
    )
    .query(({ input }) => {
      return searchCatagory("items", input.query, input.locale).slice(
        0,
        input.maxResults - 1
      );
    }),
  fetchItemData: procedure
    .input(z.object({ locale: localesSchema, itemId: z.string() }))
    .query(({ input }) => {
      const itemData = get("items").find((i) => i.id === input.itemId)!;

      const localeData = get(`locale-${input.locale}`);

      const sellFor = formatBuySellFor(itemData.sellFor, input.locale);
      const buyFor = formatBuySellFor(itemData.buyFor, input.locale);
      const highestSell = sellFor.sort((a, b) => b.priceRUB - a.priceRUB)[0];
      const lowestBuy = buyFor.sort((a, b) => a.priceRUB - b.priceRUB)[0];

      return {
        iconLink: itemData.image512pxLink,
        wikiLink: itemData.wikiLink,
        id: itemData.id,
        name: localeData[`${itemData.id} Name`] ?? "item_name",
        shortName: localeData[`${itemData.id} Shortname`] ?? "item_short_name",
        highestSell,
        lowestBuy,
        sellFor,
        buyFor,
        width: itemData.width,
        height: itemData.height,
        props: itemData.properties,
      };
    }),
  tryItemInput: procedure
    .input(
      z.object({
        query: z.string(),
        locale: localesSchema,
      })
    )
    .query(({ input }) => {
      return get(`itemsMap-${input.locale}`)[input.query.toLowerCase()];
    }),
});
