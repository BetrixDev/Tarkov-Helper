export interface TarkovDevItem {
    id: string;
    shortName: string;
    name: string;
    types: TarkovDevTypes[];
    updated: Date;
    changeLast48hPercent: number | null;
    width: number;
    height: number;
    wikiLink: string;
    basePrice: number;
    avg24hPrice: number;
    sellFor: ItemPrice[];
    buyFor: ItemPrice[];
}

export interface ItemPrice {
    vendor: Vendor;
    priceRUB: number;
}

export interface Vendor {
    name: VendorName;
}

export type VendorName =
    | "Fence"
    | "Flea Market"
    | "Jaeger"
    | "Mechanic"
    | "Peacekeeper"
    | "Prapor"
    | "Ragman"
    | "Skier"
    | "Therapist";

export type TarkovDevTypes =
    | "ammo"
    | "ammoBox"
    | "armor"
    | "backpack"
    | "barter"
    | "container"
    | "glasses"
    | "grenade"
    | "gun"
    | "headphones"
    | "helmet"
    | "injectors"
    | "keys"
    | "markedOnly"
    | "meds"
    | "mods"
    | "noFlea"
    | "pistolGrip"
    | "preset"
    | "provisions"
    | "rig"
    | "suppressor"
    | "wearable";
