import { VendorName } from "../../src/typings/TarkovDevItem";

export interface TarkovDevBarter {
    id: string;
    trader: Trader;
    level: number;
    requiredItems: BarterItem[];
    rewardItems: BarterItem[];
}

export interface BarterItem {
    count: number;
    item: Item;
    attributes: Attribute[] | null;
}

export interface Attribute {
    type: "minLevel";
    name: "minLevel";
    value: string;
}

export interface Item {
    id: string;
    name: string;
}

export interface Trader {
    name: VendorName;
}
