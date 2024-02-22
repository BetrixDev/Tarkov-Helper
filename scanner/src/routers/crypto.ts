import { z } from "zod";
import { db } from "../db/index.js";
import { iconHashesTable } from "../db/tables/icon-hashes.js";
import { procedure, router } from "../trpc.js";
import axios from "axios";
import { phash } from "../phash.js";

const iconHashes = await db.select().from(iconHashesTable).execute();

export const cryptoRouter = router({
  getHashFromUrl: procedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const urlReponse = await axios(input.url, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(urlReponse.data);

      return await phash(buffer);
    }),
  getClosestHash: procedure
    .input(z.object({ hash: z.string() }))
    .query(async ({ input }) => {
      console.time("done");

      const r = getClosestHash(input.hash);
      console.timeEnd("done");

      return r;
    }),
});

function getClosestHash(input: string) {
  let lowest: { dist: number; entry: { itemId: string; hash: string } } = {
    dist: Infinity,
    entry: { itemId: "", hash: "" },
  };

  for (let i = 0; i < iconHashes.length; i++) {
    const currentEntry = iconHashes[i];

    if (input.length !== currentEntry.hash.length) {
      return lowest;
    }

    let dist = 0;

    for (let o = 0; o < input.length; o++) {
      if (input[o] !== currentEntry.hash[o]) {
        dist++;
      }
    }

    if (dist < lowest.dist) {
      lowest = {
        dist,
        entry: currentEntry,
      };
    }
  }

  return lowest;
}
