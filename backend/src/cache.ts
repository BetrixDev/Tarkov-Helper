import { readFileSync, readdirSync } from "fs";
import { schedule } from "node-cron";
import { tarkovDev } from "./gql/client";
import { AllQuery } from "./gql/generated";
import { fetchLocales } from "./data-sources/locales";
import { SUPPORTED_LOCALES } from "common";
import { logger } from "./log";

interface CacheEntries {
  items: AllQuery["items"];
  traders: AllQuery["traders"];
  barters: AllQuery["barters"];
  playerLevels: AllQuery["playerLevels"];
  "locale-en": Record<string, string>;
  "locale-es": Record<string, string>;
  "locale-ru": Record<string, string>;
  "locale-ge": Record<string, string>;
  "itemsMap-en": Record<string, string>;
  "itemsMap-es": Record<string, string>;
  "itemsMap-ru": Record<string, string>;
  "itemsMap-ge": Record<string, string>;
}

type CacheKeys = keyof CacheEntries;

const cache: Record<string, unknown> = {};

export const fetchData = async () => {
  const tarkovDevData = await tarkovDev.all();
  const localesData = await fetchLocales();
  const itemsMaps: Record<string, Record<string, string>> = {};

  SUPPORTED_LOCALES.forEach((locale) => {
    const itemsMap: CacheEntries["itemsMap-en"] = {};
    const localeData = localesData[`locale-${locale}`];

    // TODO: Fix overlapping short names
    tarkovDevData.items.forEach(({ id }) => {
      itemsMap[id] = id;

      if (
        localeData[`${id} Name`] === undefined ||
        localeData[`${id} ShortName`] === undefined
      ) {
        return;
      }

      itemsMap[localeData[`${id} Name`].toLowerCase()] = id;
      itemsMap[localeData[`${id} ShortName`].toLowerCase()] = id;
    });

    itemsMaps[`itemsMap-${locale}`] = itemsMap;
  });

  return { ...tarkovDevData, ...localesData, ...itemsMaps };
};

const updateCache = async () => {
  logger.info("Fetching new data");

  const initialData = await fetchData();

  Object.entries(initialData).forEach(([key, value]) => {
    cache[key] = value;
  });
};

export const initCache = async () => {
  if (process.env.NODE_ENV === "development") {
    logger.info("Reading .dev cache");
    const files = readdirSync(".dev");

    files.forEach((file) => {
      cache[file.replace(".json", "")] = JSON.parse(
        readFileSync(`.dev/${file}`).toString()
      );
    });
  } else {
    await updateCache();
    // https://crontab.guru/every-30-minutes
    schedule("*/30 * * * *", updateCache);
    logger.info("Crons started");
  }
};

export const get = <T extends CacheKeys>(key: T): Readonly<CacheEntries[T]> => {
  return cache[key] as CacheEntries[T];
};
