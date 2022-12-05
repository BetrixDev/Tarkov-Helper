import "reflect-metadata";
import { LanguageCode } from "../../../types/common";
import { container } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { TarkovLocaleService } from "../../services/TarkovLocaleService";

export class Trader {
    private dataService = container.resolve(TarkovDataService);
    private localeService = container.resolve(TarkovLocaleService);

    name: string;

    constructor(name: string, language: LanguageCode) {
        const traderNames = this.dataService.fetchData(`locales/global/${language}`).trading;

        const locales = this.localeService.getTraderLocale(this.fetchTraderID(name));

        this.name = locales.name;
    }

    private fetchTraderID(name: string) {
        const enLocales = this.dataService.fetchData("locales/global/en");

        const traderData = Object.entries(enLocales).find(([id, value]) => value === name) as [string, string];

        return traderData[0];
    }
}
