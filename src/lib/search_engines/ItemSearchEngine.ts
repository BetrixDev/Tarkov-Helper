import "reflect-metadata";
import { injectable, singleton } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { Item } from "../models/Item";
import fuse from "fuse.js";
import { LanguageCode } from "../../../types/common";
import { AutocompleteInteraction } from "discord.js";
import logger from "../../logger";
import { TarkovDevTypes, TarkovDevItem } from "../../../types/tarkov.dev/TarkovDevItem";

interface EngineParams {
    id: string;
    name: string;
    shortName: string;
    types: TarkovDevTypes[];
}

type SearchResult = fuse.FuseResult<EngineParams>[];

const NAMESPACE = "ItemSearchEngine";

@singleton()
export class ItemSearchEngine {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(private dataService: TarkovDataService) {}

    private engines: Record<string, fuse<EngineParams>> = {};

    init(): void {
        const enValues: EngineParams[] = [];
        const esValues: EngineParams[] = [];

        const itemData: TarkovDevItem[] = Object.values(this.dataService.fetchData("items-tarkov-dev"));
        const itemProps = this.dataService.fetchData("items-tarkov-changes");

        itemData
            .filter((i) => itemProps[i.id] !== undefined)
            .forEach((i) => {
                const enItem = new Item(i.id, "en");
                const esItem = new Item(i.id, "es");

                enValues.push({
                    id: enItem.id,
                    types: enItem.data.types,
                    name: enItem.name,
                    shortName: enItem.shortName
                });
                esValues.push({
                    id: esItem.id,
                    types: esItem.data.types,
                    name: esItem.name,
                    shortName: esItem.shortName
                });
            });

        this.engines["en"] = new fuse(enValues, { keys: ["id", "name", "shortName"] });
        this.engines["es"] = new fuse(esValues, { keys: ["id", "name", "shortName"] });

        Object.freeze(this.engines);

        logger.info(NAMESPACE, "Initialized item search engine");
    }

    /**
     * Item search function
     * @param input input string for the search
     * @param language what language the search engine should use
     * @param guard if defined, every result will be tested against the guard, if the guard returns false, the item is removed from the results
     */
    search(input: string, language: LanguageCode, guard?: (item: Item) => boolean): SearchResult {
        const engine = this.engines[language];
        const results = engine.search<EngineParams>(input).slice(0, 24);

        logger.info(NAMESPACE, `Searching for ${input}`);

        if (!guard) {
            return results;
        } else {
            return results.filter((r) => {
                return guard(new Item(r.item.id, "en"));
            });
        }
    }

    handleAutoComplete(interaction: AutocompleteInteraction, guard?: (item: Item) => boolean): void {
        const input = interaction.options.getFocused(true).value.toString();
        const language = interaction.locale.split("-")[0] as LanguageCode;

        const results = this.search(input, language, guard);

        interaction.respond(
            results.map((r) => {
                return {
                    name: r.item.name,
                    value: r.item.id
                };
            })
        );
    }
}
