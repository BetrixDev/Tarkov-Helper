import "reflect-metadata";
import { injectable, singleton } from "tsyringe";
import { LanguageCode } from "../typings/common";
import { TarkovDataService } from "./TarkovDataService";

@singleton()
@injectable()
export class TarkovLocaleService {
    constructor(private dataService: TarkovDataService) {}

    private localized(lang: LanguageCode) {
        return this.dataService.fetchData(`locales/global/${lang}`);
    }

    getItemLocale(id: string, lang: LanguageCode = "en") {
        const locales = this.localized(lang);

        return {
            name: locales[`${id} Name`],
            shortName: locales[`${id} ShortName`],
            description: locales[`${id} Description`]
        };
    }

    getQuestLocale(id: string, lang: LanguageCode = "en") {
        const locales = this.localized(lang);

        return {
            name: locales[`${id} name`],
            description: locales[`${id} description`],
            failMessageText: locales[`${id} failMessageText`],
            successMessageText: locales[`${id} successMessageText`]
        };
    }

    getTraderLocale(id: string, lang: LanguageCode = "en") {
        const locales = this.localized(lang);

        return {
            fullName: locales[`${id} FullName`],
            firstName: locales[`${id} FirstName`],
            name: locales[`${id} Nickname`],
            location: locales[`${id} Location`],
            description: locales[`${id} Description`]
        };
    }
}
