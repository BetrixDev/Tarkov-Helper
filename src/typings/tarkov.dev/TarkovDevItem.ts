export type KeysOf<T extends object> = {
    [Key in keyof T]: T extends Record<Key, T[Key]> ? Key : never;
}[keyof T];

export type TarkovDevItem = {
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
};

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
    ItemPropertiesGlasses = "ItemPropertiesGlasses",
    ItemPropertiesChestRig = "ItemPropertiesChestRig",
    ItemPropertiesBackpack = "ItemPropertiesBackpack"
}

export type TarkovDevItemProperties =
    | null
    | ItemProperties
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
    | ItemPropertiesGlasses
    | ItemPropertiesBackpack
    | ItemPropertiesChestRig;

export type CombinedItemProps =
    | KeysOf<ItemPropertiesWeapon>
    | KeysOf<ItemPropertiesKey>
    | KeysOf<ItemPropertiesGrenade>
    | KeysOf<ItemPropertiesWeaponMod>
    | KeysOf<ItemPropertiesAmmo>
    | KeysOf<ItemPropertiesPreset>
    | KeysOf<ItemPropertiesBarrel>
    | KeysOf<ItemPropertiesMagazine>
    | KeysOf<ItemPropertiesFoodDrink>
    | KeysOf<ItemPropertiesStim>
    | KeysOf<ItemPropertiesMedKit>
    | KeysOf<ItemPropertiesMedicalItem>
    | KeysOf<ItemPropertiesMelee>
    | KeysOf<ItemPropertiesNightVision>
    | KeysOf<ItemPropertiesPainkiller>
    | KeysOf<ItemPropertiesScope>
    | KeysOf<ItemPropertiesSurgicalKit>
    | KeysOf<ItemPropertiesHelmet>
    | KeysOf<ItemPropertiesArmor>
    | KeysOf<ItemPropertiesContainer>
    | KeysOf<ItemPropertiesGlasses>
    | KeysOf<ItemPropertiesBackpack>;

export type ItemProperties = {
    __typename: TarkovDevItemType;
};

export type ItemPropertiesBackpack = ItemProperties & {
    capacity: number;
    grids: {
        width: number;
        height: number;
    };
};

export type ItemPropertiesWeapon = ItemProperties & {
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
    } | null;
};

export type ItemPropertiesKey = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesKey;
    uses: number;
};

export type ItemPropertiesGrenade = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesGrenade;
    type: GrenadeType;
    fuse: number;
    minExplosionDistance: number;
    maxExplosionDistance: number;
    fragments: number;
    contusionRadius: number;
};

export type ItemPropertiesWeaponMod = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesWeaponMod;
    ergonomics: number;
    recoilModifier: number;
    accuracyModifier: number;
    slots: ItemSlot[];
};

export type ItemPropertiesAmmo = ItemProperties & {
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
};

/** We currently ignore weapon presets */
export type ItemPropertiesPreset = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesPreset;
};

export type ItemPropertiesBarrel = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesBarrel;
    ergonomics: number;
    recoilModifier: number;
    slots: ItemSlot[];
};

export type ItemPropertiesMagazine = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesMagazine;
    ergonomics: number;
    recoilModifier: number;
    capacity: number;
    loadModifier: number;
    ammoCheckModifier: number;
    malfultionChance: number;
    allowedAmmo: AllowBullet[];
};

export type ItemPropertiesFoodDrink = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesFoodDrink;
    energy: number;
    hydration: number;
    units: number;
    stimEffects: StimEffect[];
};

export type ItemPropertiesStim = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesStim;
    useTime: number;
    cures: HealthCure[];
    stimEffects: StimEffect[];
};

export type ItemPropertiesMedKit = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesMedKit;
    hitpoints: number;
    useTIme: number;
    maxHealPerUse: number;
    cures: HealthCure[];
    hpCostLightBleeding: number;
    hpCostHeavyBleeding: number;
};

export type ItemPropertiesMedicalItem = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesMedicalItem;
    uses: number;
    useTime: number;
    cures: HealthCure[];
};

export type ItemPropertiesMelee = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesMelee;
    slashDamage: number;
    stabDamage: number;
    hitRadius: number;
};

export type ItemPropertiesNightVision = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesNightVision;
    intensity: number;
    noiseIntensity: number;
    noiseScale: number;
    diffuseItensity: number;
};

export type ItemPropertiesPainkiller = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesPainkiller;
    uses: number;
    useTime: number;
    cures: HealthCure[];
    painkillerDuration: number;
    energyImpact: number;
    hydrationImpact: number;
};

export type ItemPropertiesScope = ItemProperties & {
    ergonomics: number;
    sightModes: number[];
    sightingRange: number;
    recoilModifier: number;
    slots: ItemSlot[];
    zoomLevels: number[][];
};

export type ItemPropertiesSurgicalKit = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesSurgicalKit;
    uses: number;
    useTime: number;
    cures: HealthCure[];
    minLimbHealth: number;
    maxLimbHealth: number;
};

export type ItemPropertiesHelmet = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesHelmet;
    class: number;
    durability: number;
    speedPenalty: number;
    turnPenalty: number;
    ergoPenalty: number;
    headZones: HeadZone[];
    material: ArmorMaterial;
    deafening: Deafening;
    blocksHeadsets: boolean;
    slots: ItemSlot[];
};

export type ItemPropertiesArmor = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesArmor;
    class: number;
    durability: number;
    speedPenalty: number;
    turnPenalty: number;
    ergoPenalty: number;
    material: ArmorMaterial;
    zones: ArmorZone[];
};

export type ItemPropertiesContainer = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesContainer;
    capacity: number;
    grids: GridSlot[];
};

export type ItemPropertiesGlasses = ItemProperties & {
    __typename: TarkovDevItemType.ItemPropertiesGlasses;
    class: number;
    durability: number;
    blindnessProtection: number;
    material: null;
};

export type ItemPropertiesChestRig = {
    __typename: TarkovDevItemType.ItemPropertiesChestRig;
    class: number | null;
    durability: number | null;
    speedPenalty: number | null;
    turnPenalty: number | null;
    ergoPenalty: number | null;
    material: ArmorMaterial | null;
    zones: ArmorZone[] | null;
    capacity: number;
    grids: { width: number; height: number }[];
};

type ArmorMaterial = {
    name: string;
    destructibility: number;
};

type AllowBullet = {
    properties: {
        caliber: string;
    };
};

type GridSlot = {
    width: number;
    height: number;
};

type ItemSlot = {
    name: string;
};

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

export type ItemPrice = {
    vendor: Vendor;
    priceRUB: number;
};

type Vendor = {
    name: string;
};

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
