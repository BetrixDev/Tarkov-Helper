import { z } from "zod";
import { procedure, router } from "../trpc";
import {
  BEAR_DOGTAG_ITEM_ID,
  SupportedLocale,
  USEC_DOGTAG_ITEM_ID,
  localesSchema,
} from "common";
import { get } from "../cache";
import { fetchItemData } from "./items";
import { fetchTraderData } from "./traders";

function fetchBarter(barterId: string, locale: SupportedLocale) {
  const barterData = get("barters").find((b) => b.id === barterId)!;

  const barterCost = barterData.requiredItems.reduce((prevCost, barterItem) => {
    const itemData = fetchItemData(barterItem.item.id, locale);

    let itemPrice = itemData.lowestBuy?.priceRUB ?? 0;

    if (
      itemData.id === USEC_DOGTAG_ITEM_ID ||
      itemData.id === BEAR_DOGTAG_ITEM_ID
    ) {
      if (barterItem.attributes && barterItem.attributes[0]) {
        // Dog tags will get a price equal to the selling price of the lowest possible level tag for the barter
        // We can directly index the array since there is only 1 possible attribute currently
        itemPrice = Number(barterItem.attributes[0].value) * 378;
      }
    }

    return itemPrice * barterItem.count + prevCost;
  }, 0);

  const traderData = {
    name: fetchTraderData(barterData.trader.id, locale).nickName,
    level: barterData.level,
  };

  const requiredItems = barterData.requiredItems.map((reqItem) => ({
    count: reqItem.count,
    item: fetchItemData(reqItem.item.id, locale),
  }));

  const reward = fetchItemData(barterData.rewardItems[0].item.id, locale);

  return {
    barterCost,
    traderData,
    requiredItems,
    reward,
  };
}

export const bartersRouter = router({
  fromRewardItem: procedure
    .input(
      z.object({
        locale: localesSchema,
        itemId: z.string(),
      })
    )
    .query(({ input }) => {
      return get("barters")
        .filter((barter) => barter.rewardItems[0].item.id === input.itemId)
        .map((barter) => fetchBarter(barter.id, input.locale));
    }),
  fromRequiredItem: procedure
    .input(
      z.object({
        locale: localesSchema,
        itemId: z.string(),
      })
    )
    .query(({ input }) => {
      return get("barters")
        .filter((barter) =>
          barter.requiredItems.find((i) => i.item.id === input.itemId)
        )
        .map((barter) => fetchBarter(barter.id, input.locale));
    }),
});
