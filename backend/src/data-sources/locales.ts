import axios from "axios";
import { SUPPORTED_LOCALES } from "common";

const localeURL = (key: string) =>
  `https://dev.sp-tarkov.com/SPT-AKI/Server/raw/branch/master/project/assets/database/locales/global/${key}.json`;

export const fetchLocales = async () => {
  const responses = await Promise.all(
    SUPPORTED_LOCALES.map((locale) => axios(localeURL(locale)))
  );

  return SUPPORTED_LOCALES.reduce(
    (prev, locale, i) => ({ ...prev, [`locale-${locale}`]: responses[i].data }),
    {}
  ) as Record<string, Record<string, string>>;
};
