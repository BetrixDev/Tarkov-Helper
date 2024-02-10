import { asc, sql } from "drizzle-orm";
import { db } from ".";
import { iconHashesTable } from "./tables/icon-hashes";

export async function getNearestIconToHash(hash: string) {
  return await db
    .select({
      itemId: iconHashesTable.itemId,
      dist: sql`BIT_COUNT(${hash} ^ ${iconHashesTable.hash}) as dist`,
    })
    .from(iconHashesTable)
    .orderBy(asc(sql`dist`))
    .limit(10)
    .execute();
}
