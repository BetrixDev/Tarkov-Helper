import { z } from "zod";
import { procedure, router } from "../../trpc.js";
import axios from "axios";
import { writeFileSync } from "fs";
import { extractIconHashesFromInventory } from "../../extract-icon-hashes.js";
import { getClosestHash } from "../../db/functions.js";
import { backendTrpc } from "../../backend-trpc.js";

export const inventoryScannerRouter = router({
  fromUrl: procedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const imageRawResponse = await axios<number[]>(input.url, {
        responseType: "arraybuffer",
      });

      const imageBuffer = Buffer.from(imageRawResponse.data);

      writeFileSync("image.png", imageBuffer);

      const extractedIconHashes = await extractIconHashesFromInventory(
        imageBuffer
      );

      const items: {
        itemId: string;
        itemName: string;
        amount: number;
      }[] = [];

      for (const extractedHash of extractedIconHashes) {
        const closestIconHash = await getClosestHash(extractedHash);

        try {
          const itemData = await backendTrpc.items.fetchItemData.query({
            itemId: closestIconHash.itemId,
          });

          items.push({
            itemId: itemData.id,
            itemName: itemData.name,
            amount: 1,
          });
        } catch {}
      }

      return items;
    }),
});
