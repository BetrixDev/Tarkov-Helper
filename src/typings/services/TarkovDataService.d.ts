import { ItemProps } from "../game/ItemProps";
import { Globals } from "../game/Globals";
import { GameBot } from "../game/GameBot";
import { GameMap } from "../game/GameMap";
import { TarkovDevTask } from "../tarkov.dev/TarkovDevTask";
import { TarkovDevItem } from "../tarkov.dev/TarkovDevItem";
import { TarkovDevBarter } from "../tarkov.dev/TarkovDevBarter";
import { GameQuest } from "../game/GameQuest";

/** Some of api the data gets formatted to better fit our needs right of the bot */
export interface DataResponses extends ApiResponses {
    // tarkov dev
    items: Record<string, TarkovDevItem>;
}

/** Type definitions for the responses of all apis we call */
export interface ApiResponses {
    // tarkov dev
    items: TarkovDevItem[];
    barters: TarkovDevBarter[];
    hideoutStations: HideoutStations[];
    traders: Trader[];
    status: Status;
    crafts: TarkovDevCraft[];
    tasks: TarkovDevTask[];

    // tarkov data
    quests: TarkovDataQuest[];
    ammunition: TarkovDataAmmunition[];

    // tarkov database
    mapkeys: TarkovDatabaseMapKeys;
    keys: TarkovDatabaseKeys;
    questGuides: TarkovDatabaseQuestGuides;
    mapImages: TarkovDatabaseMapImages;
    itemLocations: Record<string, string[]>;

    // sp tarkov
    globals: Globals;
    "locales/global/en": Record<string, string>;
    "locales/global/es": Record<string, string>;
    "locations/bigmap/base": GameMap;
    "locations/factory4_day/base": GameMap;
    "locations/factory4_night/base": GameMap;
    "locations/interchange/base": GameMap;
    "locations/laboratory/base": GameMap;
    "locations/lighthouse/base": GameMap;
    "locations/rezervbase/base": GameMap;
    "locations/shoreline/base": GameMap;
    "locations/woods/base": GameMap;
    "templates/quests": Record<string, any>; // type safe :)
}

// tarkov dev

// crafts

export interface TarkovDevCraft {
    id: string;
    station: Omit<HideoutStations, "levels">;
    level: number;
    duration: number;
    requiredItems: DItem[];
    rewardItems: DItem[];
}

export interface DItem {
    count: number;
    item: Station;
    attributes: CraftAttribute[];
}

export interface CraftAttribute {
    type: AttributeType;
    name: AttributeType;
    value: string;
}

export type AttributeType = "functional" | "tool";

export interface Station {
    id: string;
    name: string;
}

// hideoutStations

export interface HideoutStations {
    id: string;
    name: string;
    levels: Level[];
}

interface Level {
    id: string;
    level: number;
    constructionTime: number;
    itemRequirements: ItemRequirement[];
    stationLevelRequirements: StationLevelRequirement[];
}

interface ItemRequirement {
    id: string;
    item: Item;
    count: number;
}

interface Item {
    id: string;
    name: string;
}

interface StationLevelRequirement {
    id: string;
    station: Station;
    level: number;
}

interface Station {
    name: string;
}

// traders

export interface Trader {
    name: string;
    resetTime: Date;
}

// status

export interface Status {
    currentStatuses: CurrentStatus[];
    generalStatus: GeneralStatus;
}

interface CurrentStatus {
    name: string;
    statusCode: string;
}

export enum StatusCode {
    Ok,
    Updating,
    Unstable,
    Down
}

interface GeneralStatus {
    name: string;
    message: string;
    status: number;
    statusCode: StatusCode;
}

// tarkov data

// quests

export interface TarkovDataQuest {
    id: number;
    require: Require;
    giver: number;
    turnin: number;
    title: string;
    locales: Locales;
    wiki: string;
    exp: number;
    unlocks: string[];
    reputation: Reputation[];
    objectives: Objective[];
    gameId: string;
}

interface Locales {
    en: string;
    ru?: string;
    cs?: string;
}

interface Objective {
    type: ObjectiveType;
    target: string[] | number | string;
    number: number;
    location?: number;
    id: number;
    gps?: Gps;
    tool?: Tool;
    hint?: string;
    have?: number;
    with?: Array<WithClass | string>;
}

interface Gps {
    leftPercent: number | null;
    topPercent: number | null;
    floor: Floor;
}

enum Floor {
    Basement = "Basement",
    Bunkers = "Bunkers",
    FirstFloor = "First_Floor",
    GroundFloor = "Ground_Floor",
    GroundLevel = "Ground_Level",
    SecondFloor = "Second_Floor"
}

enum Tool {
    The5991B51486F77447B112D44F = "5991b51486f77447b112d44f",
    The5Ac78A9B86F7741Cca0Bbd8D = "5ac78a9b86f7741cca0bbd8d",
    The5B4391A586F7745321235Ab2 = "5b4391a586f7745321235ab2"
}

enum ObjectiveType {
    Build = "build",
    Collect = "collect",
    Find = "find",
    Key = "key",
    Kill = "kill",
    Locate = "locate",
    Mark = "mark",
    Pickup = "pickup",
    Place = "place",
    Reputation = "reputation",
    Skill = "skill",
    Warning = "warning"
}

interface WithClass {
    type: WithType;
    name?: VendorName;
    value?: number | string;
    id?: IDElement[] | string;
}

interface IDElement {
    id: string;
}

enum VendorName {
    Durability = "durability",
    Ergonomics = "ergonomics",
    ExtendedMagazine = "Extended magazine",
    Foregrip = "Foregrip",
    Recoil = "recoil",
    SightingRange = "sighting range",
    Suppressor = "Suppressor",
    TacticalDevice = "Tactical device",
    Weight = "weight"
}

enum WithType {
    Attachment = "attachment",
    Cells = "cells",
    Part = "part",
    Stat = "stat"
}

interface Reputation {
    trader: number;
    rep: number;
}

interface Require {
    level?: number | null;
    quests: Array<number[] | number>;
    loyalty?: Loyalty[];
}

interface Loyalty {
    trader: number;
    stage: number;
}

// ammunition

export interface TarkovDataAmmunition {
    id: string;
    name: string;
    shortName: string;
    weight?: number;
    caliber: string;
    stackMaxSize?: number;
    tracer: boolean;
    tracerColor: TracerColor;
    ammoType: AmmoType;
    projectileCount: number;
    ballistics: Ballistics;
}

enum AmmoType {
    Buckshot = "buckshot",
    Bullet = "bullet",
    Grenade = "grenade"
}

interface Ballistics {
    damage: number;
    armorDamage: number;
    fragmentationChance: number;
    ricochetChance: number;
    penetrationChance: number;
    penetrationPower: number;
    accuracy: number;
    recoil: number;
    initialSpeed: number;
}

enum TracerColor {
    Green = "green",
    Red = "red",
    TracerGreen = "tracerGreen",
    TracerRed = "tracerRed"
}

// tarkov database

// map keys

// might be better to type as a Record instead of this way
export interface TarkovDatabaseMapKeys {
    theLab: MapKeyData[];
    woods: MapKeyData[];
    reserve: MapKeyData[];
    customs: MapKeyData[];
    interchange: MapKeyData[];
    shoreline: MapKeyData[];
    lighthouse: MapKeyData[];
    factory: MapKeyData[];
}

interface MapKeyData {
    name: string;
    shortName: string;
    normalizedName: string;
    id: string;
    wikiLink: string;
}

// keys

export type TarkovDatabaseKeys = Record<string, string[]>;

// quest guides

export type TarkovDatabaseQuestGuides = Record<number, { images: GuideImages[]; steps: string[] }>;

export interface GuideImages {
    url: string;
    caption?: string;
}

// map images

export type TarkovDatabaseMapImages = Record<string, MapImageData[]>;

interface MapImageData {
    name: string;
    link: string;
    author: string;
}
