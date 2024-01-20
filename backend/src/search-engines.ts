import Fuse from "fuse.js";
import { get } from "./cache";
import { SUPPORTED_LOCALES, SupportedLocale } from "common";
import { Redis } from "@upstash/redis";
import { env } from "./env";
import { algoliaItemsIndex } from "./algolia";

interface SearchCategories {
  items: {
    id: string;
    name: string;
    shortName: string;
  };
  quests: {
    id: number;
    name: string;
  };
  calibers: {
    name: string;
    id: string;
  };
}

type CategoryKey = keyof SearchCategories;

const engines: Record<string, Fuse<any>> = {};

export const refreshSearchEngines = () => {
  SUPPORTED_LOCALES.forEach((locale) => {
    const localeData = get(`locale-${locale}`);

    engines[`items-${locale}`] = new Fuse(
      get("items").map((item) => {
        return {
          id: item.id,
          name: localeData[`${item.id} Name`],
          shortName: localeData[`${item.id} ShortName`],
        };
      }),
      { keys: ["name", "shortName"] }
    );

    engines[`quests-${locale}`] = new Fuse(
      get("tasks").map((quest) => {
        return {
          id: quest.id,
          name: localeData[`${quest.id} name`],
        };
      }),
      { keys: ["name"] }
    );
  });

  engines["calibers-en"] = new Fuse(
    Object.entries(
      get("items")
        .filter((item) => item.properties?.__typename === "ItemPropertiesAmmo")
        .reduce((acc, item) => {
          // Make typescript happy
          if (item.properties.__typename !== "ItemPropertiesAmmo") return acc;

          const caliber = item.properties.caliber;

          return {
            ...acc,
            [caliber]: caliber.replace("Caliber", ""),
          };
        }, {})
    ).map(([key, value]) => ({
      id: key,
      name: value,
    })),
    { keys: ["name"] }
  );
};

export const searchCatagory = <T extends CategoryKey>(
  category: T,
  query: string,
  locale = "en"
): Fuse.FuseResult<SearchCategories[T]>[] => {
  return engines[`${category}-${locale}`].search(query);
};

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
});

type RedisCacheObject = {
  results: {
    name: string;
    value: string;
  }[];
};

export async function searchWithAlgolia<T extends CategoryKey>(
  category: T,
  query: string,
  locale: SupportedLocale = "en"
) {
  if (category !== "items") {
    return searchCatagory(category, query, locale).map((r) => r.item.id);
  }

  const algoliaResult = await algoliaItemsIndex.search<{
    id: string;
    name_en: string;
    name_es: string;
    name_ge: string;
    name_ru: string;
  }>(query);

  return algoliaResult.hits.map((r) => ({
    id: r.id,
    name: r.name_es ?? r.name_ge ?? r.name_ru ?? r.name_en,
  }));
}
