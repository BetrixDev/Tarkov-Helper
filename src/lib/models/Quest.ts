import "reflect-metadata";
import { LanguageCode } from "../../../types/common";
import { container } from "tsyringe";
import { TarkovDataService } from "../../services/TarkovDataService";
import { TaskRewards, TarkovDevTask, TaskObjective } from "../../../types/tarkov.dev/TarkovDevTask";
import { GuideImages } from "../../../types/services/TarkovDataService";
import { Trader } from "./Trader";
import { Item } from "./Item";

interface ItemRewards {
    count: number;
    item: Item;
}

/** Replaces the item rewards objects with the actual item class */
interface Rewards extends Omit<TaskRewards, "items"> {
    items: ItemRewards[];
}

interface QuestRewards {
    start: Rewards;
    finish: Rewards;
}

export class Quest {
    private dataService = container.resolve(TarkovDataService);

    name: string;
    /** The trader who gives the quest */
    trader: Trader;
    mainMap: string | undefined;
    guide: string[] = [];
    guideImages: GuideImages[] = [];
    rewards: QuestRewards;
    objectives: TaskObjective[];
    imageURL: string;
    wikiLink: string;

    /**
     * @param id integer value id and not bsg style id
     * @param language language to retrieve names in
     */
    constructor(id: number, language: LanguageCode) {
        //console.log(`Retrieving data for quest id: ${id}`);

        const tasks = this.dataService.fetchData("tasks");

        const taskData = tasks.find((t) => t.tarkovDataId === id) as TarkovDevTask;
        const rawQuestData = this.dataService.fetchData("templates/quests")[taskData.id];
        const guideData = this.dataService.fetchData("questGuides")[Number(taskData.tarkovDataId)];
        const locales = this.dataService.fetchData(`locales/global/${language}`).quest[taskData.id];

        this.name = locales.name;
        this.trader = new Trader(taskData.trader.name, language);
        this.mainMap = taskData.map?.name;
        this.objectives = taskData.objectives;
        this.wikiLink = taskData.wikiLink;

        if (guideData) {
            this.guide = guideData.steps;
            this.guideImages = guideData.images;
        }

        this.rewards = {
            start: {
                ...taskData.startRewards,
                items: taskData.startRewards.items.map((i) => ({
                    count: i.count,
                    item: new Item(i.item.id, language)
                }))
            },
            finish: {
                ...taskData.finishRewards,
                items: taskData.finishRewards.items.map((i) => ({
                    count: i.count,
                    item: new Item(i.item.id, language)
                }))
            }
        };

        if (rawQuestData) {
            this.imageURL = `https://dev.sp-tarkov.com/SPT-AKI/Server/raw/branch/development/project/assets/images/quests/${rawQuestData.image
                .replace("/files/quest/icon/", "")
                .replace(".jpg", "")}.png`;
        } else {
            this.imageURL = "";
        }
    }

    /** Returns all quests that give the specified item as a reward either for starting or completing the quest */
    static fromRewardItem(item: Item, language: LanguageCode): Quest[] {
        const tasks = container.resolve(TarkovDataService).fetchData("tasks");

        return tasks
            .filter((task) => {
                let success = false;

                task.startRewards.items.forEach((reward) => {
                    if (reward.item.id === item.id) {
                        success = true;
                    }
                });

                task.finishRewards.items.forEach((reward) => {
                    if (reward.item.id === item.id) {
                        success = true;
                    }
                });

                return success;
            })
            .map((task) => new Quest(task.tarkovDataId, language));
    }

    /** Returns all quests that require the specified item in any way */
    static fromRequiredItem(item: Item, language: LanguageCode): Quest[] {
        const tasks = container.resolve(TarkovDataService).fetchData("tasks");

        return tasks
            .filter((task) => {
                let success = false;

                task.objectives.forEach((obj) => {
                    if (obj.item && obj.item.id === item.id) {
                        success = true;
                    }
                });

                return success;
            })
            .map((task) => new Quest(task.tarkovDataId, language));
    }
}
