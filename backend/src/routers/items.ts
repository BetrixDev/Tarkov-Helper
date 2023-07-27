import z from "zod";
import { get } from "../cache";
import { procedure, router } from "../trpc";
import { searchCatagory } from "../search-engines";
import { SupportedLocale, localesSchema } from "common";
import { fetchTraderData } from "./traders";
import { AllQuery } from "../gql/generated";

export function fetchItemData(itemId: string, locale: SupportedLocale = "en") {
  const itemData = get("items").find((i) => i.id === itemId)!;

  const localeData = get(`locale-${locale}`);

  const sellFor = formatBuySellFor(itemData.sellFor, locale);
  const buyFor = formatBuySellFor(itemData.buyFor, locale);
  const highestSell = sellFor.sort((a, b) => b.priceRUB - a.priceRUB).at(0);
  const lowestBuy = buyFor.sort((a, b) => a.priceRUB - b.priceRUB).at(0);

  return {
    iconLink: itemData.image512pxLink,
    wikiLink: itemData.wikiLink,
    id: itemData.id,
    name: localeData[`${itemData.id} Name`] ?? "item_name",
    shortName: localeData[`${itemData.id} ShortName`] ?? "item_short_name",
    highestSell,
    lowestBuy,
    sellFor,
    buyFor,
    width: itemData.width,
    height: itemData.height,
    props: itemData.properties,
    canSellOnFlea: !itemData.types.includes("noFlea"),
    avg24hFleaPrice: itemData.avg24hPrice,
  };
}

const formatBuySellFor = (
  obj: AllQuery["items"][number]["buyFor"],
  locale: SupportedLocale
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
    .query(({ input }) => fetchItemData(input.itemId, input.locale)),
  tryItemInput: procedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(({ input }) => {
      return get("itemsMap-en")[input.query.toLowerCase()];
    }),
});
