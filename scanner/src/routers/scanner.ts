import { backendTrpc } from "../backend-trpc";
import { getClosestHash } from "../db/functions";
import { extractIconHashesFromInventory } from "../extract-icon-hashesh";
import { procedure, router } from "../trpc";
import z from "zod";

export const scannerRouter = router({
  scanInventory: procedure
    .input(z.object({ buffer: z.array(z.number()) }))
    .query(async ({ input }) => {
      const buffer = Buffer.from(input.buffer);

      const extractedIconHashes = await extractIconHashesFromInventory(buffer);

      const items: {
        itemId: string;
        itemName: string;
        amount: number;
      }[] = [];

      for (const extractedHash of extractedIconHashes) {
        const closestIconHash = await getClosestHash(extractedHash);

        const itemData = await backendTrpc.items.fetchItemData.query({
          itemId: closestIconHash.itemId,
        });

        items.push({
          itemId: itemData.id,
          itemName: itemData.name,
          amount: 1,
        });
      }

      return items;
    }),
});