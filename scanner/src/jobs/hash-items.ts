import { readFileSync, readdirSync } from "fs";
import { db } from "../db/index.js";
import { iconHashesTable } from "../db/tables/icon-hashes.js";
import { sql } from "drizzle-orm";
import { getHash } from "../get-hash.js";
export async function generateItemIconHashes() {
  const icons = readdirSync("icons");

  const hashes: { itemId: string; hash: string }[] = [];

  for (const iconPath of icons) {
    const iconBuffer = readFileSync(`icons/${iconPath}`);

    const iconHash = await getHash(iconBuffer, "image/png");

    hashes.push({ itemId: iconPath.replace(".png", ""), hash: iconHash });
  }

  for (let i = 0; i < Math.ceil(hashes.length / 500); i++) {
    const slice = hashes.slice(i * 500, i * 500 + 500);

    if (slice.length === 0) return;

    await db
      .insert(iconHashesTable)
      .values(slice)
      .onDuplicateKeyUpdate({ set: { itemId: sql`item_id` } });
  }
}
