export interface TarkovDevItem {
    id: string;
    shortName: string;
    name: string;
    image512pxLink: string;
    types: TarkovDevBasicType[];
    avg24hPrice: number;
    width: number;
    height: number;
    wikiLink: string;
    basePrice: number;
    sellFor: ItemPrice[];
    buyFor: ItemPrice[];
    properties: TarkovDevItemProperties;
}

export enum TarkovDevItemType {
    ItemPropertiesWeapon = "ItemPropertiesWeapon",
    ItemPropertiesKey = "ItemPropertiesKey",
    ItemPropertiesGrenade = "ItemPropertiesGrenade",
    ItemPropertiesWeaponMod = "ItemPropertiesWeaponMod",
    ItemPropertiesAmmo = "ItemPropertiesAmmo",
    ItemPropertiesPreset = "ItemPropertiesPreset",
    ItemPropertiesBarrel = "ItemPropertiesBarrel",
    ItemPropertiesMagazine = "ItemPropertiesMagazine",
    ItemPropertiesFoodDrink = "ItemPropertiesFoodDrink",
    ItemPropertiesStim = "ItemPropertiesStim",
    ItemPropertiesMedKit = "ItemPropertiesMedKit",
    ItemPropertiesMedicalItem = "ItemPropertiesMedicalItem",
    ItemPropertiesMelee = "ItemPropertiesMelee",
    ItemPropertiesNightVision = "ItemPropertiesNightVision",
    ItemPropertiesPainkiller = "ItemPropertiesPainkiller",
    ItemPropertiesScope = "ItemPropertiesScope",
    ItemPropertiesSurgicalKit = "ItemPropertiesSurgicalKit",
    ItemPropertiesHelmet = "ItemPropertiesHelmet",
    ItemPropertiesArmor = "ItemPropertiesArmor",
    ItemPropertiesContainer = "ItemPropertiesContainer",
    ItemPropertiesGlasses = "ItemPropertiesGlasses"
}

export type TarkovDevItemProperties =
    | null
    | ItemPropertiesWeapon
    | ItemPropertiesKey
    | ItemPropertiesGrenade
    | ItemPropertiesWeaponMod
    | ItemPropertiesAmmo
    | ItemPropertiesPreset
    | ItemPropertiesBarrel
    | ItemPropertiesMagazine
    | ItemPropertiesFoodDrink
    | ItemPropertiesStim
    | ItemPropertiesMedKit
    | ItemPropertiesMedicalItem
    | ItemPropertiesMelee
    | ItemPropertiesNightVision
    | ItemPropertiesPainkiller
    | ItemPropertiesScope
    | ItemPropertiesSurgicalKit
    | ItemPropertiesHelmet
    | ItemPropertiesArmor
    | ItemPropertiesContainer
    | ItemPropertiesGlasses;

export interface ItemPropertiesWeapon {
    __typename: TarkovDevItemType.ItemPropertiesWeapon;
    caliber: string;
    defaultAmmo: {
        id: string;
        shortName: string;
    };
    effectiveDistance: number;
    fireModes: WeaponFireMode[];
    fireRate: number;
    maxDurability: number;
    defaultPreset: {
        properties: {
            ergonomics: number;
            recoilVertical: number;
            recoilHorizontal: number;
            moa: number;
        };
    };
}

export interface ItemPropertiesKey {
    __typename: TarkovDevItemType.ItemPropertiesKey;
    uses: number;
}

export interface ItemPropertiesGrenade {
    __typename: TarkovDevItemType.ItemPropertiesGrenade;
    type: GrenadeType;
    fuse: number;
    minExplosionDistance: number;
    maxExplosionDistance: number;
    fragments: number;
    contusionRadius: number;
}

export interface ItemPropertiesWeaponMod {
    __typename: TarkovDevItemType.ItemPropertiesWeaponMod;
    ergonomics: number;
    recoilModifier: number;
    accuracyModifier: number;
    slots: ItemSlot[];
}

export interface ItemPropertiesAmmo {
    __typename: TarkovDevItemType.ItemPropertiesAmmo;
    caliber: string;
    stackMaxSize: number;
    tracer: boolean;
    tracerColor: TracerColor;
    ammoType: AmmoType;
    projectileCount: number;
    damage: number;
    armorDamage: number;
    fragmentationChance: number;
    penetrationPower: number;
    accuracyModifier: number;
    recoilModifier: number;
    initialSpeed: number;
    lightBleedModifier: number;
    heavyBleedModifier: number;
    durabilityBurnFactor: number;
    heatFactor: number;
}

/** We currently ignore weapon presets */
export interface ItemPropertiesPreset {
    __typename: TarkovDevItemType.ItemPropertiesPreset;
}

export interface ItemPropertiesBarrel {
    __typename: TarkovDevItemType.ItemPropertiesBarrel;
    ergonomics: number;
    recoilModifier: number;
    slots: ItemSlot[];
}

export interface ItemPropertiesMagazine {
    __typename: TarkovDevItemType.ItemPropertiesMagazine;
    ergonomics: number;
    recoilModifier: number;
    capacity: number;
    loadModifier: number;
    ammoCheckModifier: number;
    malfultionChance: number;
    allowedAmmo: AllowBullet[];
}

export interface ItemPropertiesFoodDrink {
    __typename: TarkovDevItemType.ItemPropertiesFoodDrink;
    energy: number;
    hydration: number;
    units: number;
    stimEffects: StimEffect[];
}

export interface ItemPropertiesStim {
    __typename: TarkovDevItemType.ItemPropertiesStim;
    useTime: number;
    cures: HealthCure[];
    stimEffects: StimEffect[];
}

export interface ItemPropertiesMedKit {
    __typename: TarkovDevItemType.ItemPropertiesMedKit;
    hitpoints: number;
    useTIme: number;
    maxHealPerUse: number;
    cures: HealthCure[];
    hpCostLightBleeding: number;
    hpCostHeavyBleeding: number;
}

export interface ItemPropertiesMedicalItem {
    __typename: TarkovDevItemType.ItemPropertiesMedicalItem;
    uses: number;
    useTime: number;
    cures: HealthCure[];
}

export interface ItemPropertiesMelee {
    __typename: TarkovDevItemType.ItemPropertiesMelee;
    slashDamage: number;
    stabDamage: number;
    hitRadius: number;
}

export interface ItemPropertiesNightVision {
    __typename: TarkovDevItemType.ItemPropertiesNightVision;
    intensity: number;
    noiseIntensity: number;
    noiseScale: number;
    diffuseItensity: number;
}

export interface ItemPropertiesPainkiller {
    __typename: TarkovDevItemType.ItemPropertiesPainkiller;
    uses: number;
    useTime: number;
    cures: HealthCure[];
    painkillerDuration: number;
    energyImpact: number;
    hydrationImpact: number;
}

export interface ItemPropertiesScope {
    ergonomics: number;
    sightModes: number[];
    sightingRange: number;
    recoilModifier: number;
    slots: ItemSlot[];
    zoomLevels: number[][];
}

export interface ItemPropertiesSurgicalKit {
    __typename: TarkovDevItemType.ItemPropertiesSurgicalKit;
    uses: number;
    useTime: number;
    cures: HealthCure[];
    minLimbHealth: number;
    maxLimbHealth: number;
}

export interface ItemPropertiesHelmet {
    __typename: TarkovDevItemType.ItemPropertiesHelmet;
    class: number;
    durability: number;
    speedPenalty: number;
    turnPenalty: number;
    ergoPenalty: number;
    headZones: HeadZone[];
    material: {
        name: string;
    };
    deafening: Deafening;
    blocksHeadsets: boolean;
    slots: ItemSlot[];
}

export interface ItemPropertiesArmor {
    __typename: TarkovDevItemType.ItemPropertiesArmor;
    class: number;
    durability: number;
    speedPenalty: number;
    turnPenalty: number;
    ergoPenalty: number;
    material: {
        name: string;
    };
    zones: ArmorZone[];
}

export interface ItemPropertiesContainer {
    __typename: TarkovDevItemType.ItemPropertiesContainer;
    capacity: number;
    grids: GridSlot[];
}

export interface ItemPropertiesGlasses {
    __typename: TarkovDevItemType.ItemPropertiesGlasses;
    class: number;
    durability: number;
    blindnessProtection: number;
    material: null;
}

interface AllowBullet {
    properties: {
        caliber: string;
    };
}

interface GridSlot {
    width: number;
    height: number;
}

interface ItemSlot {
    name: string;
}

type StimEffect = {
    type: SkillEffectType;
    chance: number;
    delay: number;
    duration: number;
    value: number;
    precent: boolean;
    skillName: null;
} & {
    type: "Skill";
    skillName: string;
};

export interface ItemPrice {
    vendor: Vendor;
    priceRUB: number;
}

interface Vendor {
    name: string;
}

type WeaponFireMode = "Single Fire" | "Full Auto" | "Semi-auto" | "Double-Tap" | "Burst fire" | "Double action";
type GrenadeType = "Grenade" | "Flashbang" | "Smoke" | "Impact Grenade";
type TracerColor = "tracerRed" | "red" | "green" | "tracerGreen" | "yellow";
type AmmoType = "bullet" | "buckshot";
type HeadZone = "Top" | "Nape";
type Deafening = "None" | "High" | "Low";
type ArmorZone = "THORAX" | "STOMACH" | "Right Arm" | "Left Arm";
type HealthCure = "LightBleeding" | "HeavyBleeding" | "Pain" | "Contusion" | "LostLimb" | "Fracture";
type SkillEffectType =
    | "Skill"
    | "Health regeneration"
    | "Hands tremor"
    | "Tunnel effect"
    | "Energy recovery"
    | "Hydration recovery";
export type TarkovDevBasicType =
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
