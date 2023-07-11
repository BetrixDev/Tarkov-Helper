import { z } from "zod";
import { procedure, router } from "../trpc";
import { SupportLocale, localesSchema } from "common";
import { get } from "../cache";
import { itemsRouter } from "./items";

const itemCaller = itemsRouter.createCaller({});

const fetchBarter = async (barterId: string, locale: SupportLocale) => {
  const barterData = get("barters").find((b) => b.id === barterId);
};

export const bartersRouter = router({
  fromRewardItem: procedure
    .input(
      z.object({
        locale: localesSchema,
        itemId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return get("barters")
        .filter((barter) => barter.rewardItems[0].item.id === input.itemId)
        .map(async (barter) => await fetchBarter(barter.id, input.locale));
    }),
  fromRequiredItem: procedure
    .input(
      z.object({
        locale: localesSchema,
        itemId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return get("barters")
        .filter((barter) =>
          barter.requiredItems.find((i) => i.item.id === input.itemId)
        )
        .map(async (barter) => await fetchBarter(barter.id, input.locale));
    }),
});
