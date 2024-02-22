import axios from "axios";
import { z } from "zod";
import { backendTrpc } from "../backend-trpc.js";
import { getClosestHash } from "../db/functions.js";
import { procedure, router } from "../trpc.js";
import { phash } from "../phash.js";

export const itemScannerRouter = router({
  fromUrl: procedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const imageRawResponse = await axios<number[]>(input.url, {
        responseType: "arraybuffer",
      });

      const imageBuffer = Buffer.from(imageRawResponse.data);
      const imageHash = await phash(imageBuffer);
      const closestIconHash = await getClosestHash(imageHash);

      console.log(closestIconHash);

      const itemData = await backendTrpc.items.fetchItemData.query({
        itemId: closestIconHash.itemId,
      });

      return {
        itemId: itemData.id,
        itemName: itemData.name,
      };
    }),
});
