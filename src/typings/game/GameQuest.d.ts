export interface GameQuest {
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
    reputationFailure?: Reputation[];
    alternatives?: number[];
    nokappa?: boolean;
}

export interface Locales {
    en: string;
    ru?: string;
    cs?: string;
}

export interface Objective {
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

export interface Gps {
    leftPercent: number;
    topPercent: number;
    floor: Floor;
}

export enum Floor {
    Basement = "Basement",
    Bunkers = "Bunkers",
    FirstFloor = "First_Floor",
    GroundFloor = "Ground_Floor",
    GroundLevel = "Ground_Level",
    SecondFloor = "Second_Floor"
}

export enum Tool {
    The5991B51486F77447B112D44F = "5991b51486f77447b112d44f",
    The5Ac78A9B86F7741Cca0Bbd8D = "5ac78a9b86f7741cca0bbd8d",
    The5B4391A586F7745321235Ab2 = "5b4391a586f7745321235ab2"
}

export enum ObjectiveType {
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

export interface WithClass {
    type: WithType;
    name?: Name;
    value?: number | string;
    id?: IdElement[] | string;
}

export interface IdElement {
    id: string;
}

export enum Name {
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

export enum WithType {
    Attachment = "attachment",
    Cells = "cells",
    Part = "part",
    Stat = "stat"
}

export interface Reputation {
    trader: number;
    rep: number;
}

export interface Require {
    level?: number | null;
    quests: Array<number[] | number>;
    loyalty?: Loyalty[];
}

export interface Loyalty {
    trader: number;
    stage: number;
}
