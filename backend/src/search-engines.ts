import Fuse from "fuse.js";
import { get } from "./cache.js";
import { SUPPORTED_LOCALES } from "common";
import lunr from "lunr";

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

const engines: Record<string, lunr.Index> = {};

export const refreshSearchEngines = () => {
  SUPPORTED_LOCALES.forEach((locale) => {
    const localeData = get(`locale-${locale}`);

    engines[`items-${locale}`] = lunr(function () {
      this.field("name");
      this.field("shortName");

      get("items").forEach((item) => {
        this.add({
          id: item.id,
          name: item.name,
          shortName: item.shortName,
        });
      });
    });

    engines[`quests-${locale}`] = lunr(function () {
      this.field("name");

      get("tasks").forEach((quest) => {
        this.add({
          id: quest.id,
          name: localeData[`${quest.id} name`],
        });
      });
    });
  });

  engines["caliber-en"] = lunr(function () {
    this.field("name");

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
    ).forEach(([key, value]) => {
      this.add({
        id: key,
        name: value,
      });
    });
  });
};

export const searchCatagory = <T extends CategoryKey>(
  category: T,
  query: string,
  locale = "en"
) => {
  return engines[`${category}-${locale}`].search(query);
};
