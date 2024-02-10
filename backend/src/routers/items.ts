import z from "zod";
import { get } from "../cache.js";
import { procedure, router } from "../trpc.js";
import { searchCatagory } from "../search-engines.js";
import { SupportedLocale, localesSchema } from "common";
import { fetchTraderData } from "./traders.js";
import { AllQuery } from "../gql/generated.js";

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
  searchCalibers: procedure
    .input(z.object({ query: z.string(), maxResults: z.number().default(25) }))
    .query(({ input }) => {
      return searchCatagory("calibers", input.query).slice(
        0,
        input.maxResults - 1
      );
    }),
  fetchCaliberData: procedure
    .input(
      z.object({
        caliberId: z.string(),
        locale: localesSchema,
      })
    )
    .query(({ input }) => {
      const bullets = get("items").filter(
        (item) =>
          item.properties?.__typename === "ItemPropertiesAmmo" &&
          item.properties.caliber === input.caliberId
      );

      return bullets;
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
  needForQuest: procedure
    .input(
      z.object({
        locale: localesSchema,
        itemId: z.string(),
      })
    )
    .query(({ input }) => {
      const data = {
        quests: [] as { name: string; amount: number }[],
        foundInRaid: 0,
        nonFir: 0,
        place: 0,
      };

      function pushQuest(id: string, amount: number) {
        data.quests.push({
          name: get(`locale-${input.locale}`)[`${id} name`],
          amount,
        });
      }

      get("tasks").forEach((quest) => {
        quest.objectives.forEach((obj) => {
          if (
            obj.__typename === "TaskObjectiveItem" &&
            obj.item.id === input.itemId
          ) {
            if (obj.type === "plantItem") {
              data.place += obj.count;
              pushQuest(quest.id, obj.count);
            } else if (obj.type === "giveItem") {
              if (obj.foundInRaid) {
                data.foundInRaid += obj.count;
              } else {
                data.nonFir += obj.count;
              }

              pushQuest(quest.id, obj.count);
            }
          }
        });
      });

      return data;
    }),
  all: procedure.query(() => {
    return get("items").map((item) => ({
      id: item.id,
      name: item.name,
      iconLink: item.image512pxLink,
    }));
  }),
});

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

function formatBuySellFor(
  obj: AllQuery["items"][number]["buyFor"],
  locale: SupportedLocale
) {
  return obj.map((s) => {
    const traderData = fetchTraderData(s.vendor.normalizedName, locale);

    return {
      price: s.price,
      priceRUB: s.priceRUB,
      traderId: traderData.id,
      traderNickName: traderData.nickName,
    };
  });
}
