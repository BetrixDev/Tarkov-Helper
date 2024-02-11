import { asc, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { iconHashesTable } from "./tables/icon-hashes.js";

export async function getClosestHash(hash: string) {
  const res = await db
    .select({
      itemId: iconHashesTable.itemId,
      hammingDistance: sql<number>`get_hamming_dist(${hash}, ${iconHashesTable.hash}) as hammingDistance`,
    })
    .from(iconHashesTable)
    .orderBy(asc(sql`hammingDistance`))
    .limit(1);

  return res[0];
}
