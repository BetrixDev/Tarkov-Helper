import { readFileSync, readdirSync, writeFileSync } from "fs";
import phash from "sharp-phash";
import { db } from "../db";
import { iconHashesTable } from "../db/tables/icon-hashes";
import { sql } from "drizzle-orm";
import { getNearestIconToHash } from "../db/functions";

export async function generateItemIconHashes() {
  const icons = readdirSync("icons");

  const hashes: { itemId: string; hash: string }[] = [];

  for (const iconPath of icons) {
    const iconBuffer = readFileSync(`icons/${iconPath}`);

    const iconHash = await phash(iconBuffer);

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

  process.exit(0);
}

generateItemIconHashes();

// async function getHash() {
//   const buffer = readFileSync("61bc85697113f767765c7fe7-512.png");

//   console.log(await phash(buffer));
// }

// getHash();

// writeFileSync(
//   "res.json",
//   JSON.stringify(
//     await getNearestIconToHash(
//       "1111011101111111110011100000000100001000111111110101000011100000"
//     ),
//     null,
//     2
//   )
// );
