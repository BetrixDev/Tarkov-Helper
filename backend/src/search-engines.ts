import Fuse from "fuse.js";
import { get } from "./cache";
import { SUPPORTED_LOCALES } from "common";

interface SearchCatagories {
  items: {
    id: string;
    name: string;
    shortName: string;
  };
}

type CatagoryKeys = keyof SearchCatagories;

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
  });
};

export const searchCatagory = <T extends CatagoryKeys>(
  catagory: T,
  query: string,
  locale = "en"
): Fuse.FuseResult<SearchCatagories[T]>[] => {
  return engines[`${catagory}-${locale}`].search(query);
};
