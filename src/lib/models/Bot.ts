import "reflect-metadata";
import { container } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { DataReponses } from "../../../types/services/TarkovDataService";
import { GameBot } from "../../../types/game/GameBot";

interface BotData {
    name: string;
    maps: string[];
    fetchData: () => GameBot;
}

const BOTS: BotData[] = [
    {
        name: "Scav",
        maps: [],
        fetchData: () => {
            return container.resolve(TarkovDataService).fetchData("ammunition");
        }
    }
];

export class Bot {}
