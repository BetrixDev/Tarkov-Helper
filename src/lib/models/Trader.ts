import "reflect-metadata";
import { LanguageCode } from "../../typings/common";
import { container } from "tsyringe";
import { TarkovLocaleService } from "../../services/TarkovLocaleService";

export class Trader {
    private localeService = container.resolve(TarkovLocaleService);

    name: string;

    constructor(id: string, language: LanguageCode) {
        const locales = this.localeService.getTraderLocale(id, language);

        this.name = locales.name;
    }
}
