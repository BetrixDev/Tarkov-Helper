import "reflect-metadata";
import { LanguageCode } from "../../../types/common";
import { container } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { Trading } from "../../../types/game/GameLocales";

export class Trader {
    name: string;

    constructor(name: string, language: LanguageCode) {
        const dataService = container.resolve(TarkovDataService);

        const traderNames = dataService.fetchData(`locales/global/${language}`).trading;

        const [id] = this.fetchTraderObject(name, dataService);

        this.name = traderNames[id].Nickname;
    }

    private fetchTraderObject(name: string, dataService: TarkovDataService) {
        const traderNames = dataService.fetchData("locales/global/en").trading;

        const traderData = Object.entries(traderNames).find(([id, data]) => data.Nickname === name);

        return traderData as [string, Trading];
    }
}
