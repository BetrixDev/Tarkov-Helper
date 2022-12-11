export interface TarkovDevTask {
    id: string;
    tarkovDataId: number;
    name: string;
    trader: Trader;
    map: { name: string };
    experience: number;
    wikiLink: string;
    minPlayerLevel: number | null;
    taskRequirements: TaskRequirement[];
    traderLevelRequirements: TraderLevelRequirement[];
    objectives: TaskObjective[];
    startRewards: TaskRewards;
    finishRewards: TaskRewards;
}

export interface TaskRewards {
    items: ItemElement[];
    offerUnlock: OfferUnlock[];
    traderUnlock: Trader[];
}

export interface ItemElement {
    item: ItemItem;
    count: number;
}

export interface ItemItem {
    id: string;
    name: string;
}

export interface OfferUnlock {
    trader: Trader;
    level: number;
    item: ItemItem;
}

export interface Trader {
    id: string;
}

export interface TaskObjective {
    id: string;
    type: Type;
    description: string;
    maps: Trader[];
    optional: boolean;
    item?: ItemItem;
    count?: number;
    foundInRaid?: boolean;
}

export type Type =
    | "buildWeapon"
    | "experience"
    | "extract"
    | "findItem"
    | "findQuestItem"
    | "giveItem"
    | "giveQuestItem"
    | "mark"
    | "plantItem"
    | "plantQuestItem"
    | "playerLevel"
    | "shoot"
    | "skill"
    | "taskStatus"
    | "traderLevel"
    | "visit";

export interface TaskRequirement {
    task: Trader;
    status: Status[];
}

export enum Status {
    Active = "active",
    Complete = "complete",
    Failed = "failed"
}

export interface TraderLevelRequirement {
    id: string;
    trader: Trader;
    level: number;
}
