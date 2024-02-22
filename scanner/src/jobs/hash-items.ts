import { db } from "../db/index.js";
import { iconHashesTable } from "../db/tables/icon-hashes.js";
import { inArray, sql } from "drizzle-orm";
import { phash } from "../phash.js";
import AdmZip from "adm-zip";
import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { logger } from "../log.js";
import { getItemsWithIconLinks } from "../tarkov-dev.js";

const RAT_SCANNER_DATA_MASTER_DOWNLOAD_URL =
  "https://github.com/RatScanner/RatScannerData/archive/refs/heads/master.zip";
const RAT_SCANNER_CONTENTS_ENDPOINT =
  "https://ungh.cc/repos/RatScanner/RatScannerData/files/master"; // GitHub's API has trouble actually returning all icons

const ONE_MINUTE = 1000 * 60 * 1;
const ROWS_IN_SLICE_TO_UPLOAD = 500;

const _axiosInstance = Axios.create({});
const axios = setupCache(_axiosInstance, { ttl: ONE_MINUTE });

generateItemIconHashes();

export async function generateItemIconHashes() {
  logger.info("grabbing icons");

  const items = await getItemsWithIconLinks();
  const totalItems = items.length;

  const currentHashedIcons = await db.select().from(iconHashesTable).execute();
  const [{ currentHashIconsAmount }] = await db
    .select({ currentHashIconsAmount: sql<number>`count(*)` })
    .from(iconHashesTable)
    .execute();

  logger.info(`${totalItems}`);
  logger.info(`${currentHashIconsAmount}`);

  if (totalItems === currentHashIconsAmount) {
    // No difference in items added or removed
    logger.info("icons r good");
    return;
  }

  if (totalItems < currentHashIconsAmount) {
    // Some items were removed, so we removed them from the hash db
    const iconsToDelete: string[] = [];

    logger.info("detdddelting items");
    for (const hashedIcon of currentHashedIcons) {
      const doesItemExistInTarkovDev =
        items.find((i) => i.id === hashedIcon.itemId) !== undefined;

      if (doesItemExistInTarkovDev) continue;

      iconsToDelete.push(hashedIcon.itemId);
    }

    logger.info("detelting items");

    await db
      .delete(iconHashesTable)
      .where(inArray(iconHashesTable.itemId, iconsToDelete))
      .execute();

    return;
  }

  // Add new items to the hash db

  const iconsToHash: string[] = [];

  for (const item of items) {
    const isIconAlreadyHashed =
      currentHashedIcons.find((i) => i.itemId === item.id) !== undefined;

    if (isIconAlreadyHashed) continue;

    iconsToHash.push(item.id);
  }

  if (iconsToHash.length === 0) {
    logger.info("No new icons to hash");
    return;
  }

  logger.info(iconsToHash.length.toString());

  const iconsInRatScannerData = await getIconsInRatScannerData(iconsToHash);

  const iconsForTarkovDevToFetch = iconsToHash
    .filter((i) => !iconsInRatScannerData.includes(i)) // Only download icons that aren't in Rat Scanner Data
    .slice(0, 5); // Download icons from tarkov.dev in batches of 10, just incase there's alot of icons

  const hashedIcons: { itemId: string; hash: string }[] = [];

  logger.info(
    `Attempting to grab the hashes for ${iconsToHash.length} item(s)`
  );

  logger.info(
    `Getting ${iconsInRatScannerData.length} icon(s) from Rat Scanner Data`
  );

  const ratScannerIcons = await getHashedIconsFromRatScanner(
    iconsInRatScannerData
  );
  const tarkovDevIcons = await getHashedIconsFromTarkovDev(
    iconsForTarkovDevToFetch
  );

  hashedIcons.push(...ratScannerIcons);
  hashedIcons.push(...tarkovDevIcons);

  for (
    let s = 0;
    s < Math.ceil(hashedIcons.length / ROWS_IN_SLICE_TO_UPLOAD);
    s++
  ) {
    const slice = hashedIcons.slice(
      s * ROWS_IN_SLICE_TO_UPLOAD,
      s * ROWS_IN_SLICE_TO_UPLOAD + ROWS_IN_SLICE_TO_UPLOAD
    );

    if (slice.length === 0) return;

    await db
      .insert(iconHashesTable)
      .values(slice)
      .onDuplicateKeyUpdate({ set: { itemId: sql`item_id` } })
      .execute();
  }

  logger.info(`Interserted ${iconsToHash.length} row(s)`);
  process.exit(0);
}

async function getHashedIconsFromRatScanner(iconsToHash: string[]) {
  if (iconsToHash.length === 0) return [];

  if (iconsToHash.length > 25) {
    return await getHashedRatScannerIconsFromArchive(iconsToHash);
  }

  logger.info("going from contents");
  return await getHashedRatScannerIconsFromContents(iconsToHash);
}

async function getHashedRatScannerIconsFromContents(iconsToHash: string[]) {
  const contents = await getRatScannerDataContents();

  const promises: Promise<{ itemId: string; hash: string }>[] = [];

  for (const itemId of iconsToHash) {
    const iconEntry = contents.find((e) => {
      const entryItemId = itemIdFromFilePath(e.path);
      return itemId === entryItemId;
    });

    if (iconEntry === undefined) continue;

    promises.push(
      new Promise((res) => {
        axios(getIconDownloadUrl(iconEntry.path), {
          responseType: "arraybuffer",
        }).then((iconBuffer) => {
          phash(iconBuffer.data).then((iconHash) => {
            res({ hash: iconHash, itemId });
          });
        });
      })
    );
  }

  return await Promise.all(promises);
}

async function getHashedRatScannerIconsFromArchive(iconsToHash: string[]) {
  const hashedIcons: { itemId: string; hash: string }[] = [];

  logger.info("downloading archive");

  const res = await axios(RAT_SCANNER_DATA_MASTER_DOWNLOAD_URL, {
    responseType: "arraybuffer",
  });

  logger.info("downloaded archive");

  const archive = new AdmZip(res.data);

  for (const entry of archive.getEntries()) {
    if (
      !entry.entryName.startsWith("RatScannerData-master/icons/") ||
      entry.entryName.endsWith(".json")
    ) {
      continue;
    }

    const itemId = itemIdFromFilePath(entry.entryName);
    const isIconNeeded = iconsToHash.find((i) => i === itemId) !== undefined;

    if (!isIconNeeded) {
      continue;
    }

    const iconHash = await phash(entry.getData());

    hashedIcons.push({
      itemId,
      hash: iconHash,
    });
  }

  return hashedIcons;
}

async function getIconsInRatScannerData(ids: string[]) {
  const ratScannerDataContents = await getRatScannerDataContents();

  return ids.filter((id) => {
    const doesHaveIconInRepo =
      ratScannerDataContents.find((e) => {
        return itemIdFromFilePath(e.path) === id;
      }) !== undefined;

    return doesHaveIconInRepo;
  });
}

type RatScannerDataContentsEntry = {
  path: string;
};

async function getRatScannerDataContents() {
  const res = await axios<{ files: RatScannerDataContentsEntry[] }>(
    RAT_SCANNER_CONTENTS_ENDPOINT
  );

  return res.data.files;
}

async function getHashedIconsFromTarkovDev(iconsToHash: string[]) {
  const hashedIcons: { itemId: string; hash: string }[] = [];

  const itemsWithIconLinks = await getItemsWithIconLinks();

  for (const itemId of iconsToHash) {
    const itemData = itemsWithIconLinks.find((i) => {
      return i.id === itemId;
    });

    if (itemData === undefined) continue;

    const iconBuffer = await axios(itemData.iconLink, {
      responseType: "arraybuffer",
    });

    const iconHash = await phash(iconBuffer.data);

    hashedIcons.push({ itemId, hash: iconHash });
  }

  return hashedIcons;
}

function itemIdFromFilePath(path: string) {
  return path.split(".")[0].split("/").at(-1)!;
}

function getIconDownloadUrl(basePath: string) {
  return `https://raw.githubusercontent.com/RatScanner/RatScannerData/master/${basePath}`;
}
