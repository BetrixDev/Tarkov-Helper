import { asc, sql } from "drizzle-orm";
import { db } from ".";
import { iconHashesTable } from "./tables/icon-hashes";

export async function getClosestHash(hash: string) {
  const res = await db
    .select({
      itemId: iconHashesTable.itemId,
      hammingDistance: sql<number>`get_hamming_distance(${hash}, ${iconHashesTable.hash}) as hammingDistance`,
    })
    .from(iconHashesTable)
    .orderBy(asc(sql`hammingDistance`))
    .limit(1);

  return res[0];
}
