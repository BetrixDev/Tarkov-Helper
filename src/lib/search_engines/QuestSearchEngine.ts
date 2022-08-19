import fuse from "fuse.js";
import { singleton } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import logger from "../../logger";
import { LanguageCode } from "../../../types/common";
import { Quest } from "../models/Quest";
import { AutocompleteInteraction } from "discord.js";
import { BaseCommand } from "../BaseCommand";

interface EngineParams {
    id: number;
    name: string;
}

type SearchResult = fuse.FuseResult<EngineParams>[];

const NAMESPACE = "QuestSearchEngine";

@singleton()
export class QuestSearchEngine {
    constructor(private dataService: TarkovDataService) {}

    private engines: Record<string, fuse<EngineParams>> = {};

    init() {
        const enValues: EngineParams[] = [];
        const esValues: EngineParams[] = [];

        const questData = this.dataService.fetchData("quests");
        const enLocales = this.dataService.fetchData("locales/global/en").quest;
        const esLocales = this.dataService.fetchData("locales/global/es").quest;

        questData.forEach(({ gameId, id }) => {
            if (gameId && id) {
                esValues.push({ name: esLocales[gameId].name, id: id });
                enValues.push({ name: enLocales[gameId].name, id: id });
            }
        });

        this.engines["en"] = new fuse(enValues, { keys: ["name"] });
        this.engines["es"] = new fuse(esValues, { keys: ["name"] });

        Object.freeze(this.engines);

        logger.info(NAMESPACE, "Initialized quest search engine");
    }

    /**
     * Quest search function
     * @param input input string for the search
     * @param language what language the search engine should use
     * @param guard if defined, every result will be tested against the guard, if the guard returns false, the item is removed from the results
     */
    search(input: string, language: LanguageCode, guard?: (quest: Quest) => boolean): SearchResult {
        const engine = this.engines[language];
        const results = engine.search<EngineParams>(input).slice(0, 24);

        logger.info(
            NAMESPACE,
            `Searching for "${input}" (${results.length} results) ${
                results.length > 0 ? `("${results[0].item.name}" top)` : ""
            }`
        );

        if (!guard) {
            return results;
        } else {
            return results.filter((r) => {
                return guard(new Quest(Number(r.item.id), "en"));
            });
        }
    }

    handleAutoComplete(interaction: AutocompleteInteraction, guard?: (quest: Quest) => boolean): void {
        const input = interaction.options.getFocused(true).value.toString();
        const language = new BaseCommand().getLanguage(interaction);

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
