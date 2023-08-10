import { GraphQLClient } from "graphql-request";
import { GraphQLClientRequestHeaders } from "graphql-request/build/cjs/types";
import gql from "graphql-tag";
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Ammo = {
  readonly __typename?: "Ammo";
  /** @deprecated Use accuracyModifier instead. */
  readonly accuracy: Maybe<Scalars["Int"]["output"]>;
  readonly accuracyModifier: Maybe<Scalars["Float"]["output"]>;
  readonly ammoType: Scalars["String"]["output"];
  readonly armorDamage: Scalars["Int"]["output"];
  readonly caliber: Maybe<Scalars["String"]["output"]>;
  readonly damage: Scalars["Int"]["output"];
  readonly fragmentationChance: Scalars["Float"]["output"];
  readonly heavyBleedModifier: Scalars["Float"]["output"];
  readonly initialSpeed: Maybe<Scalars["Float"]["output"]>;
  readonly item: Item;
  readonly lightBleedModifier: Scalars["Float"]["output"];
  readonly penetrationChance: Scalars["Float"]["output"];
  readonly penetrationPower: Scalars["Int"]["output"];
  readonly projectileCount: Maybe<Scalars["Int"]["output"]>;
  /** @deprecated Use recoilModifier instead. */
  readonly recoil: Maybe<Scalars["Int"]["output"]>;
  readonly recoilModifier: Maybe<Scalars["Float"]["output"]>;
  readonly ricochetChance: Scalars["Float"]["output"];
  readonly stackMaxSize: Scalars["Int"]["output"];
  readonly staminaBurnPerDamage: Maybe<Scalars["Float"]["output"]>;
  readonly tracer: Scalars["Boolean"]["output"];
  readonly tracerColor: Maybe<Scalars["String"]["output"]>;
  readonly weight: Scalars["Float"]["output"];
};

export type ArmorMaterial = {
  readonly __typename?: "ArmorMaterial";
  readonly destructibility: Maybe<Scalars["Float"]["output"]>;
  readonly explosionDestructibility: Maybe<Scalars["Float"]["output"]>;
  readonly id: Maybe<Scalars["String"]["output"]>;
  readonly maxRepairDegradation: Maybe<Scalars["Float"]["output"]>;
  readonly maxRepairKitDegradation: Maybe<Scalars["Float"]["output"]>;
  readonly minRepairDegradation: Maybe<Scalars["Float"]["output"]>;
  readonly minRepairKitDegradation: Maybe<Scalars["Float"]["output"]>;
  readonly name: Maybe<Scalars["String"]["output"]>;
};

export type AttributeThreshold = {
  readonly __typename?: "AttributeThreshold";
  readonly name: Scalars["String"]["output"];
  readonly requirement: NumberCompare;
};

export type Barter = {
  readonly __typename?: "Barter";
  readonly id: Scalars["ID"]["output"];
  readonly level: Scalars["Int"]["output"];
  readonly requiredItems: ReadonlyArray<Maybe<ContainedItem>>;
  /** @deprecated Use level instead. */
  readonly requirements: ReadonlyArray<Maybe<PriceRequirement>>;
  readonly rewardItems: ReadonlyArray<Maybe<ContainedItem>>;
  /** @deprecated Use trader and level instead. */
  readonly source: Scalars["String"]["output"];
  /** @deprecated Use trader instead. */
  readonly sourceName: ItemSourceName;
  readonly taskUnlock: Maybe<Task>;
  readonly trader: Trader;
};

export type BossEscort = {
  readonly __typename?: "BossEscort";
  readonly amount: Maybe<ReadonlyArray<Maybe<BossEscortAmount>>>;
  readonly boss: MobInfo;
  /** @deprecated Use boss.name instead. */
  readonly name: Scalars["String"]["output"];
  /** @deprecated Use boss.normalizedName instead. */
  readonly normalizedName: Scalars["String"]["output"];
};

export type BossEscortAmount = {
  readonly __typename?: "BossEscortAmount";
  readonly chance: Scalars["Float"]["output"];
  readonly count: Scalars["Int"]["output"];
};

export type BossSpawn = {
  readonly __typename?: "BossSpawn";
  readonly boss: MobInfo;
  readonly escorts: ReadonlyArray<Maybe<BossEscort>>;
  /** @deprecated Use boss.name instead. */
  readonly name: Scalars["String"]["output"];
  /** @deprecated Use boss.normalizedName instead. */
  readonly normalizedName: Scalars["String"]["output"];
  readonly spawnChance: Scalars["Float"]["output"];
  readonly spawnLocations: ReadonlyArray<Maybe<BossSpawnLocation>>;
  readonly spawnTime: Maybe<Scalars["Int"]["output"]>;
  readonly spawnTimeRandom: Maybe<Scalars["Boolean"]["output"]>;
  readonly spawnTrigger: Maybe<Scalars["String"]["output"]>;
};

/**
 * The chances of spawning in a given location are
 * very rough estimates and may be incaccurate
 */
export type BossSpawnLocation = {
  readonly __typename?: "BossSpawnLocation";
  readonly chance: Scalars["Float"]["output"];
  readonly name: Scalars["String"]["output"];
  readonly spawnKey: Scalars["String"]["output"];
};

export type ContainedItem = {
  readonly __typename?: "ContainedItem";
  readonly attributes: Maybe<ReadonlyArray<Maybe<ItemAttribute>>>;
  readonly count: Scalars["Float"]["output"];
  readonly item: Item;
  readonly quantity: Scalars["Float"]["output"];
};

export type Craft = {
  readonly __typename?: "Craft";
  readonly duration: Scalars["Int"]["output"];
  readonly id: Scalars["ID"]["output"];
  readonly level: Scalars["Int"]["output"];
  readonly requiredItems: ReadonlyArray<Maybe<ContainedItem>>;
  readonly requiredQuestItems: ReadonlyArray<Maybe<QuestItem>>;
  /** @deprecated Use stationLevel instead. */
  readonly requirements: ReadonlyArray<Maybe<PriceRequirement>>;
  readonly rewardItems: ReadonlyArray<Maybe<ContainedItem>>;
  /** @deprecated Use stationLevel instead. */
  readonly source: Scalars["String"]["output"];
  /** @deprecated Use stationLevel instead. */
  readonly sourceName: Scalars["String"]["output"];
  readonly station: HideoutStation;
  readonly taskUnlock: Maybe<Task>;
};

export type FleaMarket = Vendor & {
  readonly __typename?: "FleaMarket";
  readonly enabled: Scalars["Boolean"]["output"];
  readonly minPlayerLevel: Scalars["Int"]["output"];
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Scalars["String"]["output"];
  readonly reputationLevels: ReadonlyArray<Maybe<FleaMarketReputationLevel>>;
  readonly sellOfferFeeRate: Scalars["Float"]["output"];
  readonly sellRequirementFeeRate: Scalars["Float"]["output"];
};

export type FleaMarketReputationLevel = {
  readonly __typename?: "FleaMarketReputationLevel";
  readonly maxRep: Scalars["Float"]["output"];
  readonly minRep: Scalars["Float"]["output"];
  readonly offers: Scalars["Int"]["output"];
};

export type GameProperty = {
  readonly __typename?: "GameProperty";
  readonly arrayValue: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly key: Scalars["String"]["output"];
  readonly numericValue: Maybe<Scalars["Float"]["output"]>;
  readonly objectValue: Maybe<Scalars["String"]["output"]>;
  readonly stringValue: Maybe<Scalars["String"]["output"]>;
};

export type HandbookCategoryName =
  | "Ammo"
  | "AmmoPacks"
  | "AssaultCarbines"
  | "AssaultRifles"
  | "AssaultScopes"
  | "AuxiliaryParts"
  | "Backpacks"
  | "Barrels"
  | "BarterItems"
  | "Bipods"
  | "BodyArmor"
  | "BoltActionRifles"
  | "BuildingMaterials"
  | "ChargingHandles"
  | "Collimators"
  | "CompactCollimators"
  | "Drinks"
  | "ElectronicKeys"
  | "Electronics"
  | "EnergyElements"
  | "Eyewear"
  | "Facecovers"
  | "FlammableMaterials"
  | "FlashhidersBrakes"
  | "Flashlights"
  | "Food"
  | "Foregrips"
  | "FunctionalMods"
  | "GasBlocks"
  | "Gear"
  | "GearComponents"
  | "GearMods"
  | "GrenadeLaunchers"
  | "Handguards"
  | "Headgear"
  | "Headsets"
  | "HouseholdMaterials"
  | "InfoItems"
  | "Injectors"
  | "InjuryTreatment"
  | "IronSights"
  | "Keys"
  | "LaserTargetPointers"
  | "Launchers"
  | "LightLaserDevices"
  | "MachineGuns"
  | "Magazines"
  | "Maps"
  | "MarksmanRifles"
  | "MechanicalKeys"
  | "MedicalSupplies"
  | "Medication"
  | "Medkits"
  | "MeleeWeapons"
  | "Money"
  | "Mounts"
  | "MuzzleAdapters"
  | "MuzzleDevices"
  | "Optics"
  | "Others"
  | "Pills"
  | "PistolGrips"
  | "Pistols"
  | "Provisions"
  | "ReceiversSlides"
  | "Rounds"
  | "SMGs"
  | "SecureContainers"
  | "Shotguns"
  | "Sights"
  | "SpecialEquipment"
  | "SpecialPurposeSights"
  | "SpecialWeapons"
  | "StocksChassis"
  | "StorageContainers"
  | "Suppressors"
  | "TacticalComboDevices"
  | "TacticalRigs"
  | "Throwables"
  | "Tools"
  | "Valuables"
  | "VitalParts"
  | "WeaponPartsMods"
  | "Weapons";

export type HealthEffect = {
  readonly __typename?: "HealthEffect";
  readonly bodyParts: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  readonly effects: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  readonly time: Maybe<NumberCompare>;
};

export type HealthPart = {
  readonly __typename?: "HealthPart";
  readonly bodyPart: Scalars["String"]["output"];
  readonly id: Scalars["ID"]["output"];
  readonly max: Scalars["Int"]["output"];
};

/** HideoutModule has been replaced with HideoutStation. */
export type HideoutModule = {
  readonly __typename?: "HideoutModule";
  /** @deprecated Use HideoutStation type instead. */
  readonly id: Maybe<Scalars["Int"]["output"]>;
  readonly itemRequirements: ReadonlyArray<Maybe<ContainedItem>>;
  readonly level: Maybe<Scalars["Int"]["output"]>;
  readonly moduleRequirements: ReadonlyArray<Maybe<HideoutModule>>;
  /** @deprecated Use HideoutStation type instead. */
  readonly name: Maybe<Scalars["String"]["output"]>;
};

export type HideoutStation = {
  readonly __typename?: "HideoutStation";
  /** crafts is only available via the hideoutStations query. */
  readonly crafts: ReadonlyArray<Maybe<Craft>>;
  readonly id: Scalars["ID"]["output"];
  readonly levels: ReadonlyArray<Maybe<HideoutStationLevel>>;
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Scalars["String"]["output"];
  readonly tarkovDataId: Maybe<Scalars["Int"]["output"]>;
};

export type HideoutStationBonus = {
  readonly __typename?: "HideoutStationBonus";
  readonly name: Scalars["String"]["output"];
  readonly passive: Maybe<Scalars["Boolean"]["output"]>;
  readonly production: Maybe<Scalars["Boolean"]["output"]>;
  readonly skillName: Maybe<Scalars["String"]["output"]>;
  readonly slotItems: Maybe<ReadonlyArray<Maybe<Item>>>;
  readonly type: Scalars["String"]["output"];
  readonly value: Maybe<Scalars["Float"]["output"]>;
};

export type HideoutStationLevel = {
  readonly __typename?: "HideoutStationLevel";
  readonly bonuses: Maybe<ReadonlyArray<Maybe<HideoutStationBonus>>>;
  readonly constructionTime: Scalars["Int"]["output"];
  /** crafts is only available via the hideoutStations query. */
  readonly crafts: ReadonlyArray<Maybe<Craft>>;
  readonly description: Scalars["String"]["output"];
  readonly id: Scalars["ID"]["output"];
  readonly itemRequirements: ReadonlyArray<Maybe<RequirementItem>>;
  readonly level: Scalars["Int"]["output"];
  readonly skillRequirements: ReadonlyArray<Maybe<RequirementSkill>>;
  readonly stationLevelRequirements: ReadonlyArray<
    Maybe<RequirementHideoutStationLevel>
  >;
  readonly tarkovDataId: Maybe<Scalars["Int"]["output"]>;
  readonly traderRequirements: ReadonlyArray<Maybe<RequirementTrader>>;
};

export type Item = {
  readonly __typename?: "Item";
  readonly accuracyModifier: Maybe<Scalars["Float"]["output"]>;
  readonly avg24hPrice: Maybe<Scalars["Int"]["output"]>;
  readonly backgroundColor: Scalars["String"]["output"];
  readonly bartersFor: ReadonlyArray<Maybe<Barter>>;
  readonly bartersUsing: ReadonlyArray<Maybe<Barter>>;
  readonly baseImageLink: Maybe<Scalars["String"]["output"]>;
  readonly basePrice: Scalars["Int"]["output"];
  readonly blocksHeadphones: Maybe<Scalars["Boolean"]["output"]>;
  /** @deprecated Use category instead. */
  readonly bsgCategory: Maybe<ItemCategory>;
  readonly bsgCategoryId: Maybe<Scalars["String"]["output"]>;
  readonly buyFor: Maybe<ReadonlyArray<ItemPrice>>;
  readonly categories: ReadonlyArray<Maybe<ItemCategory>>;
  readonly category: Maybe<ItemCategory>;
  /** @deprecated No longer meaningful with inclusion of Item category. */
  readonly categoryTop: Maybe<ItemCategory>;
  readonly changeLast48h: Maybe<Scalars["Float"]["output"]>;
  readonly changeLast48hPercent: Maybe<Scalars["Float"]["output"]>;
  readonly conflictingItems: Maybe<ReadonlyArray<Maybe<Item>>>;
  readonly conflictingSlotIds: Maybe<
    ReadonlyArray<Maybe<Scalars["String"]["output"]>>
  >;
  readonly containsItems: Maybe<ReadonlyArray<Maybe<ContainedItem>>>;
  readonly craftsFor: ReadonlyArray<Maybe<Craft>>;
  readonly craftsUsing: ReadonlyArray<Maybe<Craft>>;
  readonly description: Maybe<Scalars["String"]["output"]>;
  readonly ergonomicsModifier: Maybe<Scalars["Float"]["output"]>;
  readonly fleaMarketFee: Maybe<Scalars["Int"]["output"]>;
  readonly gridImageLink: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Fallback handled automatically by gridImageLink. */
  readonly gridImageLinkFallback: Scalars["String"]["output"];
  readonly handbookCategories: ReadonlyArray<Maybe<ItemCategory>>;
  readonly hasGrid: Maybe<Scalars["Boolean"]["output"]>;
  readonly height: Scalars["Int"]["output"];
  readonly high24hPrice: Maybe<Scalars["Int"]["output"]>;
  /** historicalPrices is only available via the item and items queries. */
  readonly historicalPrices: Maybe<ReadonlyArray<Maybe<HistoricalPricePoint>>>;
  readonly iconLink: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Fallback handled automatically by iconLink. */
  readonly iconLinkFallback: Scalars["String"]["output"];
  readonly id: Scalars["ID"]["output"];
  readonly image8xLink: Maybe<Scalars["String"]["output"]>;
  readonly image512pxLink: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use inspectImageLink instead. */
  readonly imageLink: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Fallback handled automatically by inspectImageLink. */
  readonly imageLinkFallback: Scalars["String"]["output"];
  readonly inspectImageLink: Maybe<Scalars["String"]["output"]>;
  readonly lastLowPrice: Maybe<Scalars["Int"]["output"]>;
  readonly lastOfferCount: Maybe<Scalars["Int"]["output"]>;
  readonly link: Maybe<Scalars["String"]["output"]>;
  readonly loudness: Maybe<Scalars["Int"]["output"]>;
  readonly low24hPrice: Maybe<Scalars["Int"]["output"]>;
  readonly name: Maybe<Scalars["String"]["output"]>;
  readonly normalizedName: Maybe<Scalars["String"]["output"]>;
  readonly properties: Maybe<ItemProperties>;
  readonly receivedFromTasks: ReadonlyArray<Maybe<Task>>;
  readonly recoilModifier: Maybe<Scalars["Float"]["output"]>;
  readonly sellFor: Maybe<ReadonlyArray<ItemPrice>>;
  readonly shortName: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use sellFor instead. */
  readonly traderPrices: ReadonlyArray<Maybe<TraderPrice>>;
  /** @deprecated Use the lang argument on queries instead. */
  readonly translation: Maybe<ItemTranslation>;
  readonly types: ReadonlyArray<Maybe<ItemType>>;
  readonly updated: Maybe<Scalars["String"]["output"]>;
  readonly usedInTasks: ReadonlyArray<Maybe<Task>>;
  readonly velocity: Maybe<Scalars["Float"]["output"]>;
  readonly weight: Maybe<Scalars["Float"]["output"]>;
  readonly width: Scalars["Int"]["output"];
  readonly wikiLink: Maybe<Scalars["String"]["output"]>;
};

export type ItemFleaMarketFeeArgs = {
  count: InputMaybe<Scalars["Int"]["input"]>;
  hideoutManagementLevel: InputMaybe<Scalars["Int"]["input"]>;
  intelCenterLevel: InputMaybe<Scalars["Int"]["input"]>;
  price: InputMaybe<Scalars["Int"]["input"]>;
  requireAll: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ItemTranslationArgs = {
  languageCode: InputMaybe<LanguageCode>;
};

export type ItemAttribute = {
  readonly __typename?: "ItemAttribute";
  readonly name: Scalars["String"]["output"];
  readonly type: Scalars["String"]["output"];
  readonly value: Maybe<Scalars["String"]["output"]>;
};

export type ItemCategory = {
  readonly __typename?: "ItemCategory";
  readonly children: Maybe<ReadonlyArray<Maybe<ItemCategory>>>;
  readonly id: Scalars["ID"]["output"];
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Scalars["String"]["output"];
  readonly parent: Maybe<ItemCategory>;
};

export type ItemCategoryName =
  | "Ammo"
  | "AmmoContainer"
  | "ArmBand"
  | "Armor"
  | "ArmoredEquipment"
  | "AssaultCarbine"
  | "AssaultRifle"
  | "AssaultScope"
  | "AuxiliaryMod"
  | "Backpack"
  | "Barrel"
  | "BarterItem"
  | "Battery"
  | "Bipod"
  | "BuildingMaterial"
  | "ChargingHandle"
  | "ChestRig"
  | "CombMuzzleDevice"
  | "CombTactDevice"
  | "CommonContainer"
  | "CompactReflexSight"
  | "Compass"
  | "CompoundItem"
  | "CylinderMagazine"
  | "Drink"
  | "Drug"
  | "Electronics"
  | "Equipment"
  | "EssentialMod"
  | "FaceCover"
  | "Flashhider"
  | "Flashlight"
  | "Food"
  | "FoodAndDrink"
  | "Foregrip"
  | "Fuel"
  | "FunctionalMod"
  | "GasBlock"
  | "GearMod"
  | "GrenadeLauncher"
  | "Handguard"
  | "Handgun"
  | "Headphones"
  | "Headwear"
  | "HideoutAreaContainer"
  | "HouseholdGoods"
  | "Info"
  | "Ironsight"
  | "Item"
  | "Jewelry"
  | "Key"
  | "Keycard"
  | "Knife"
  | "LockingContainer"
  | "Lubricant"
  | "Machinegun"
  | "Magazine"
  | "Map"
  | "MarksmanRifle"
  | "MechanicalKey"
  | "MedicalItem"
  | "MedicalSupplies"
  | "Medikit"
  | "Meds"
  | "Money"
  | "Mount"
  | "MuzzleDevice"
  | "NightVision"
  | "Other"
  | "PistolGrip"
  | "PortContainer"
  | "PortableRangeFinder"
  | "RadioTransmitter"
  | "RandomLootContainer"
  | "Receiver"
  | "ReflexSight"
  | "RepairKits"
  | "Revolver"
  | "SMG"
  | "Scope"
  | "SearchableItem"
  | "Shotgun"
  | "Sights"
  | "Silencer"
  | "SniperRifle"
  | "SpecialItem"
  | "SpecialScope"
  | "SpringDrivenCylinder"
  | "StackableItem"
  | "Stimulant"
  | "Stock"
  | "TermalVision"
  | "ThrowableWeapon"
  | "Tool"
  | "UBGL"
  | "VisObservDevice"
  | "Weapon"
  | "WeaponMod";

export type ItemFilters = {
  readonly __typename?: "ItemFilters";
  readonly allowedCategories: ReadonlyArray<Maybe<ItemCategory>>;
  readonly allowedItems: ReadonlyArray<Maybe<Item>>;
  readonly excludedCategories: ReadonlyArray<Maybe<ItemCategory>>;
  readonly excludedItems: ReadonlyArray<Maybe<Item>>;
};

export type ItemPrice = {
  readonly __typename?: "ItemPrice";
  readonly currency: Maybe<Scalars["String"]["output"]>;
  readonly currencyItem: Maybe<Item>;
  readonly price: Maybe<Scalars["Int"]["output"]>;
  readonly priceRUB: Maybe<Scalars["Int"]["output"]>;
  /** @deprecated Use vendor instead. */
  readonly requirements: ReadonlyArray<Maybe<PriceRequirement>>;
  /** @deprecated Use vendor instead. */
  readonly source: Maybe<ItemSourceName>;
  readonly vendor: Vendor;
};

export type ItemProperties =
  | ItemPropertiesAmmo
  | ItemPropertiesArmor
  | ItemPropertiesArmorAttachment
  | ItemPropertiesBackpack
  | ItemPropertiesBarrel
  | ItemPropertiesChestRig
  | ItemPropertiesContainer
  | ItemPropertiesFoodDrink
  | ItemPropertiesGlasses
  | ItemPropertiesGrenade
  | ItemPropertiesHeadphone
  | ItemPropertiesHelmet
  | ItemPropertiesKey
  | ItemPropertiesMagazine
  | ItemPropertiesMedKit
  | ItemPropertiesMedicalItem
  | ItemPropertiesMelee
  | ItemPropertiesNightVision
  | ItemPropertiesPainkiller
  | ItemPropertiesPreset
  | ItemPropertiesResource
  | ItemPropertiesScope
  | ItemPropertiesStim
  | ItemPropertiesSurgicalKit
  | ItemPropertiesWeapon
  | ItemPropertiesWeaponMod;

export type ItemPropertiesAmmo = {
  readonly __typename?: "ItemPropertiesAmmo";
  /** @deprecated Use accuracyModifier instead. */
  readonly accuracy: Maybe<Scalars["Int"]["output"]>;
  readonly accuracyModifier: Maybe<Scalars["Float"]["output"]>;
  readonly ammoType: Maybe<Scalars["String"]["output"]>;
  readonly armorDamage: Maybe<Scalars["Int"]["output"]>;
  readonly caliber: Maybe<Scalars["String"]["output"]>;
  readonly damage: Maybe<Scalars["Int"]["output"]>;
  readonly durabilityBurnFactor: Maybe<Scalars["Float"]["output"]>;
  readonly fragmentationChance: Maybe<Scalars["Float"]["output"]>;
  readonly heatFactor: Maybe<Scalars["Float"]["output"]>;
  readonly heavyBleedModifier: Maybe<Scalars["Float"]["output"]>;
  readonly initialSpeed: Maybe<Scalars["Float"]["output"]>;
  readonly lightBleedModifier: Maybe<Scalars["Float"]["output"]>;
  readonly penetrationChance: Maybe<Scalars["Float"]["output"]>;
  readonly penetrationPower: Maybe<Scalars["Int"]["output"]>;
  readonly projectileCount: Maybe<Scalars["Int"]["output"]>;
  /** @deprecated Use recoilModifier instead. */
  readonly recoil: Maybe<Scalars["Float"]["output"]>;
  readonly recoilModifier: Maybe<Scalars["Float"]["output"]>;
  readonly ricochetChance: Maybe<Scalars["Float"]["output"]>;
  readonly stackMaxSize: Maybe<Scalars["Int"]["output"]>;
  readonly staminaBurnPerDamage: Maybe<Scalars["Float"]["output"]>;
  readonly tracer: Maybe<Scalars["Boolean"]["output"]>;
  readonly tracerColor: Maybe<Scalars["String"]["output"]>;
};

export type ItemPropertiesArmor = {
  readonly __typename?: "ItemPropertiesArmor";
  readonly armorType: Maybe<Scalars["String"]["output"]>;
  readonly class: Maybe<Scalars["Int"]["output"]>;
  readonly durability: Maybe<Scalars["Int"]["output"]>;
  readonly ergoPenalty: Maybe<Scalars["Int"]["output"]>;
  readonly material: Maybe<ArmorMaterial>;
  readonly repairCost: Maybe<Scalars["Int"]["output"]>;
  readonly speedPenalty: Maybe<Scalars["Float"]["output"]>;
  readonly turnPenalty: Maybe<Scalars["Float"]["output"]>;
  readonly zones: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
};

export type ItemPropertiesArmorAttachment = {
  readonly __typename?: "ItemPropertiesArmorAttachment";
  readonly blindnessProtection: Maybe<Scalars["Float"]["output"]>;
  readonly class: Maybe<Scalars["Int"]["output"]>;
  readonly durability: Maybe<Scalars["Int"]["output"]>;
  readonly ergoPenalty: Maybe<Scalars["Int"]["output"]>;
  readonly headZones: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly material: Maybe<ArmorMaterial>;
  readonly repairCost: Maybe<Scalars["Int"]["output"]>;
  readonly speedPenalty: Maybe<Scalars["Float"]["output"]>;
  readonly turnPenalty: Maybe<Scalars["Float"]["output"]>;
};

export type ItemPropertiesBackpack = {
  readonly __typename?: "ItemPropertiesBackpack";
  readonly capacity: Maybe<Scalars["Int"]["output"]>;
  readonly ergoPenalty: Maybe<Scalars["Int"]["output"]>;
  readonly grids: Maybe<ReadonlyArray<Maybe<ItemStorageGrid>>>;
  /** @deprecated Use grids instead. */
  readonly pouches: Maybe<ReadonlyArray<Maybe<ItemStorageGrid>>>;
  readonly speedPenalty: Maybe<Scalars["Float"]["output"]>;
  readonly turnPenalty: Maybe<Scalars["Float"]["output"]>;
};

export type ItemPropertiesBarrel = {
  readonly __typename?: "ItemPropertiesBarrel";
  /** @deprecated Use centerOfImpact, deviationCurve, and deviationMax instead. */
  readonly accuracyModifier: Maybe<Scalars["Float"]["output"]>;
  readonly centerOfImpact: Maybe<Scalars["Float"]["output"]>;
  readonly deviationCurve: Maybe<Scalars["Float"]["output"]>;
  readonly deviationMax: Maybe<Scalars["Float"]["output"]>;
  readonly ergonomics: Maybe<Scalars["Float"]["output"]>;
  /** @deprecated Use recoilModifier instead. */
  readonly recoil: Maybe<Scalars["Float"]["output"]>;
  readonly recoilModifier: Maybe<Scalars["Float"]["output"]>;
  readonly slots: Maybe<ReadonlyArray<Maybe<ItemSlot>>>;
};

export type ItemPropertiesChestRig = {
  readonly __typename?: "ItemPropertiesChestRig";
  readonly armorType: Maybe<Scalars["String"]["output"]>;
  readonly capacity: Maybe<Scalars["Int"]["output"]>;
  readonly class: Maybe<Scalars["Int"]["output"]>;
  readonly durability: Maybe<Scalars["Int"]["output"]>;
  readonly ergoPenalty: Maybe<Scalars["Int"]["output"]>;
  readonly grids: Maybe<ReadonlyArray<Maybe<ItemStorageGrid>>>;
  readonly material: Maybe<ArmorMaterial>;
  /** @deprecated Use grids instead. */
  readonly pouches: Maybe<ReadonlyArray<Maybe<ItemStorageGrid>>>;
  readonly repairCost: Maybe<Scalars["Int"]["output"]>;
  readonly speedPenalty: Maybe<Scalars["Float"]["output"]>;
  readonly turnPenalty: Maybe<Scalars["Float"]["output"]>;
  readonly zones: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
};

export type ItemPropertiesContainer = {
  readonly __typename?: "ItemPropertiesContainer";
  readonly capacity: Maybe<Scalars["Int"]["output"]>;
  readonly grids: Maybe<ReadonlyArray<Maybe<ItemStorageGrid>>>;
};

export type ItemPropertiesFoodDrink = {
  readonly __typename?: "ItemPropertiesFoodDrink";
  readonly energy: Maybe<Scalars["Int"]["output"]>;
  readonly hydration: Maybe<Scalars["Int"]["output"]>;
  readonly stimEffects: ReadonlyArray<Maybe<StimEffect>>;
  readonly units: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesGlasses = {
  readonly __typename?: "ItemPropertiesGlasses";
  readonly blindnessProtection: Maybe<Scalars["Float"]["output"]>;
  readonly class: Maybe<Scalars["Int"]["output"]>;
  readonly durability: Maybe<Scalars["Int"]["output"]>;
  readonly material: Maybe<ArmorMaterial>;
  readonly repairCost: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesGrenade = {
  readonly __typename?: "ItemPropertiesGrenade";
  readonly contusionRadius: Maybe<Scalars["Int"]["output"]>;
  readonly fragments: Maybe<Scalars["Int"]["output"]>;
  readonly fuse: Maybe<Scalars["Float"]["output"]>;
  readonly maxExplosionDistance: Maybe<Scalars["Int"]["output"]>;
  readonly minExplosionDistance: Maybe<Scalars["Int"]["output"]>;
  readonly type: Maybe<Scalars["String"]["output"]>;
};

export type ItemPropertiesHeadphone = {
  readonly __typename?: "ItemPropertiesHeadphone";
  readonly ambientVolume: Maybe<Scalars["Int"]["output"]>;
  readonly compressorAttack: Maybe<Scalars["Int"]["output"]>;
  readonly compressorGain: Maybe<Scalars["Int"]["output"]>;
  readonly compressorRelease: Maybe<Scalars["Int"]["output"]>;
  readonly compressorThreshold: Maybe<Scalars["Int"]["output"]>;
  readonly compressorVolume: Maybe<Scalars["Int"]["output"]>;
  readonly cutoffFrequency: Maybe<Scalars["Int"]["output"]>;
  readonly distanceModifier: Maybe<Scalars["Float"]["output"]>;
  readonly distortion: Maybe<Scalars["Float"]["output"]>;
  readonly dryVolume: Maybe<Scalars["Int"]["output"]>;
  readonly highFrequencyGain: Maybe<Scalars["Float"]["output"]>;
  readonly resonance: Maybe<Scalars["Float"]["output"]>;
};

export type ItemPropertiesHelmet = {
  readonly __typename?: "ItemPropertiesHelmet";
  readonly armorType: Maybe<Scalars["String"]["output"]>;
  readonly blindnessProtection: Maybe<Scalars["Float"]["output"]>;
  readonly blocksHeadset: Maybe<Scalars["Boolean"]["output"]>;
  readonly class: Maybe<Scalars["Int"]["output"]>;
  readonly deafening: Maybe<Scalars["String"]["output"]>;
  readonly durability: Maybe<Scalars["Int"]["output"]>;
  readonly ergoPenalty: Maybe<Scalars["Int"]["output"]>;
  readonly headZones: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly material: Maybe<ArmorMaterial>;
  readonly repairCost: Maybe<Scalars["Int"]["output"]>;
  readonly ricochetX: Maybe<Scalars["Float"]["output"]>;
  readonly ricochetY: Maybe<Scalars["Float"]["output"]>;
  readonly ricochetZ: Maybe<Scalars["Float"]["output"]>;
  readonly slots: Maybe<ReadonlyArray<Maybe<ItemSlot>>>;
  readonly speedPenalty: Maybe<Scalars["Float"]["output"]>;
  readonly turnPenalty: Maybe<Scalars["Float"]["output"]>;
};

export type ItemPropertiesKey = {
  readonly __typename?: "ItemPropertiesKey";
  readonly uses: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesMagazine = {
  readonly __typename?: "ItemPropertiesMagazine";
  readonly allowedAmmo: Maybe<ReadonlyArray<Maybe<Item>>>;
  readonly ammoCheckModifier: Maybe<Scalars["Float"]["output"]>;
  readonly capacity: Maybe<Scalars["Int"]["output"]>;
  readonly ergonomics: Maybe<Scalars["Float"]["output"]>;
  readonly loadModifier: Maybe<Scalars["Float"]["output"]>;
  readonly malfunctionChance: Maybe<Scalars["Float"]["output"]>;
  /** @deprecated Use recoilModifier instead. */
  readonly recoil: Maybe<Scalars["Float"]["output"]>;
  readonly recoilModifier: Maybe<Scalars["Float"]["output"]>;
  readonly slots: Maybe<ReadonlyArray<Maybe<ItemSlot>>>;
};

export type ItemPropertiesMedKit = {
  readonly __typename?: "ItemPropertiesMedKit";
  readonly cures: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly hitpoints: Maybe<Scalars["Int"]["output"]>;
  readonly hpCostHeavyBleeding: Maybe<Scalars["Int"]["output"]>;
  readonly hpCostLightBleeding: Maybe<Scalars["Int"]["output"]>;
  readonly maxHealPerUse: Maybe<Scalars["Int"]["output"]>;
  readonly useTime: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesMedicalItem = {
  readonly __typename?: "ItemPropertiesMedicalItem";
  readonly cures: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly useTime: Maybe<Scalars["Int"]["output"]>;
  readonly uses: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesMelee = {
  readonly __typename?: "ItemPropertiesMelee";
  readonly hitRadius: Maybe<Scalars["Float"]["output"]>;
  readonly slashDamage: Maybe<Scalars["Int"]["output"]>;
  readonly stabDamage: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesNightVision = {
  readonly __typename?: "ItemPropertiesNightVision";
  readonly diffuseIntensity: Maybe<Scalars["Float"]["output"]>;
  readonly intensity: Maybe<Scalars["Float"]["output"]>;
  readonly noiseIntensity: Maybe<Scalars["Float"]["output"]>;
  readonly noiseScale: Maybe<Scalars["Float"]["output"]>;
};

export type ItemPropertiesPainkiller = {
  readonly __typename?: "ItemPropertiesPainkiller";
  readonly cures: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly energyImpact: Maybe<Scalars["Int"]["output"]>;
  readonly hydrationImpact: Maybe<Scalars["Int"]["output"]>;
  readonly painkillerDuration: Maybe<Scalars["Int"]["output"]>;
  readonly useTime: Maybe<Scalars["Int"]["output"]>;
  readonly uses: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesPreset = {
  readonly __typename?: "ItemPropertiesPreset";
  readonly baseItem: Item;
  readonly default: Maybe<Scalars["Boolean"]["output"]>;
  readonly ergonomics: Maybe<Scalars["Float"]["output"]>;
  readonly moa: Maybe<Scalars["Float"]["output"]>;
  readonly recoilHorizontal: Maybe<Scalars["Int"]["output"]>;
  readonly recoilVertical: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesResource = {
  readonly __typename?: "ItemPropertiesResource";
  readonly units: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesScope = {
  readonly __typename?: "ItemPropertiesScope";
  readonly ergonomics: Maybe<Scalars["Float"]["output"]>;
  /** @deprecated Use recoilModifier instead. */
  readonly recoil: Maybe<Scalars["Float"]["output"]>;
  readonly recoilModifier: Maybe<Scalars["Float"]["output"]>;
  readonly sightModes: Maybe<ReadonlyArray<Maybe<Scalars["Int"]["output"]>>>;
  readonly sightingRange: Maybe<Scalars["Int"]["output"]>;
  readonly slots: Maybe<ReadonlyArray<Maybe<ItemSlot>>>;
  readonly zoomLevels: Maybe<
    ReadonlyArray<Maybe<ReadonlyArray<Maybe<Scalars["Float"]["output"]>>>>
  >;
};

export type ItemPropertiesStim = {
  readonly __typename?: "ItemPropertiesStim";
  readonly cures: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly stimEffects: ReadonlyArray<Maybe<StimEffect>>;
  readonly useTime: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesSurgicalKit = {
  readonly __typename?: "ItemPropertiesSurgicalKit";
  readonly cures: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly maxLimbHealth: Maybe<Scalars["Float"]["output"]>;
  readonly minLimbHealth: Maybe<Scalars["Float"]["output"]>;
  readonly useTime: Maybe<Scalars["Int"]["output"]>;
  readonly uses: Maybe<Scalars["Int"]["output"]>;
};

export type ItemPropertiesWeapon = {
  readonly __typename?: "ItemPropertiesWeapon";
  readonly allowedAmmo: Maybe<ReadonlyArray<Maybe<Item>>>;
  readonly caliber: Maybe<Scalars["String"]["output"]>;
  readonly cameraRecoil: Maybe<Scalars["Float"]["output"]>;
  readonly cameraSnap: Maybe<Scalars["Float"]["output"]>;
  readonly centerOfImpact: Maybe<Scalars["Float"]["output"]>;
  readonly convergence: Maybe<Scalars["Float"]["output"]>;
  readonly defaultAmmo: Maybe<Item>;
  readonly defaultErgonomics: Maybe<Scalars["Float"]["output"]>;
  readonly defaultHeight: Maybe<Scalars["Int"]["output"]>;
  readonly defaultPreset: Maybe<Item>;
  readonly defaultRecoilHorizontal: Maybe<Scalars["Int"]["output"]>;
  readonly defaultRecoilVertical: Maybe<Scalars["Int"]["output"]>;
  readonly defaultWeight: Maybe<Scalars["Float"]["output"]>;
  readonly defaultWidth: Maybe<Scalars["Int"]["output"]>;
  readonly deviationCurve: Maybe<Scalars["Float"]["output"]>;
  readonly deviationMax: Maybe<Scalars["Float"]["output"]>;
  readonly effectiveDistance: Maybe<Scalars["Int"]["output"]>;
  readonly ergonomics: Maybe<Scalars["Float"]["output"]>;
  readonly fireModes: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly fireRate: Maybe<Scalars["Int"]["output"]>;
  readonly maxDurability: Maybe<Scalars["Int"]["output"]>;
  readonly presets: Maybe<ReadonlyArray<Maybe<Item>>>;
  readonly recoilAngle: Maybe<Scalars["Int"]["output"]>;
  readonly recoilDispersion: Maybe<Scalars["Int"]["output"]>;
  readonly recoilHorizontal: Maybe<Scalars["Int"]["output"]>;
  readonly recoilVertical: Maybe<Scalars["Int"]["output"]>;
  readonly repairCost: Maybe<Scalars["Int"]["output"]>;
  readonly sightingRange: Maybe<Scalars["Int"]["output"]>;
  readonly slots: Maybe<ReadonlyArray<Maybe<ItemSlot>>>;
};

export type ItemPropertiesWeaponMod = {
  readonly __typename?: "ItemPropertiesWeaponMod";
  readonly accuracyModifier: Maybe<Scalars["Float"]["output"]>;
  readonly ergonomics: Maybe<Scalars["Float"]["output"]>;
  /** @deprecated Use recoilModifier instead. */
  readonly recoil: Maybe<Scalars["Float"]["output"]>;
  readonly recoilModifier: Maybe<Scalars["Float"]["output"]>;
  readonly slots: Maybe<ReadonlyArray<Maybe<ItemSlot>>>;
};

export type ItemSlot = {
  readonly __typename?: "ItemSlot";
  readonly filters: Maybe<ItemFilters>;
  readonly id: Scalars["ID"]["output"];
  readonly name: Scalars["String"]["output"];
  readonly nameId: Scalars["String"]["output"];
  readonly required: Maybe<Scalars["Boolean"]["output"]>;
};

export type ItemSourceName =
  | "fence"
  | "fleaMarket"
  | "jaeger"
  | "mechanic"
  | "peacekeeper"
  | "prapor"
  | "ragman"
  | "skier"
  | "therapist";

export type ItemStorageGrid = {
  readonly __typename?: "ItemStorageGrid";
  readonly filters: ItemFilters;
  readonly height: Scalars["Int"]["output"];
  readonly width: Scalars["Int"]["output"];
};

/**
 * The below types are all deprecated and may not return current data.
 * ItemTranslation has been replaced with the lang argument on all queries
 */
export type ItemTranslation = {
  readonly __typename?: "ItemTranslation";
  /** @deprecated Use the lang argument on queries instead. */
  readonly description: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use the lang argument on queries instead. */
  readonly name: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use the lang argument on queries instead. */
  readonly shortName: Maybe<Scalars["String"]["output"]>;
};

export type ItemType =
  | "ammo"
  | "ammoBox"
  | "any"
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

export type LanguageCode =
  | "cs"
  | "de"
  | "en"
  | "es"
  | "fr"
  | "hu"
  | "it"
  | "ja"
  | "ko"
  | "pl"
  | "pt"
  | "ru"
  | "sk"
  | "tr"
  | "zh";

export type Map = {
  readonly __typename?: "Map";
  readonly accessKeys: ReadonlyArray<Maybe<Item>>;
  readonly accessKeysMinPlayerLevel: Maybe<Scalars["Int"]["output"]>;
  readonly bosses: ReadonlyArray<Maybe<BossSpawn>>;
  readonly description: Maybe<Scalars["String"]["output"]>;
  readonly enemies: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly id: Scalars["ID"]["output"];
  readonly name: Scalars["String"]["output"];
  readonly nameId: Maybe<Scalars["String"]["output"]>;
  readonly normalizedName: Scalars["String"]["output"];
  readonly players: Maybe<Scalars["String"]["output"]>;
  readonly raidDuration: Maybe<Scalars["Int"]["output"]>;
  readonly spawns: Maybe<ReadonlyArray<Maybe<MapSpawn>>>;
  readonly tarkovDataId: Maybe<Scalars["ID"]["output"]>;
  readonly wiki: Maybe<Scalars["String"]["output"]>;
};

export type MapPosition = {
  readonly __typename?: "MapPosition";
  readonly x: Scalars["Float"]["output"];
  readonly y: Scalars["Float"]["output"];
  readonly z: Scalars["Float"]["output"];
};

export type MapSpawn = {
  readonly __typename?: "MapSpawn";
  readonly categories: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly position: MapPosition;
  readonly sides: Maybe<ReadonlyArray<Maybe<Scalars["String"]["output"]>>>;
  readonly zoneName: Maybe<Scalars["String"]["output"]>;
};

export type MobInfo = {
  readonly __typename?: "MobInfo";
  /** equipment and items are estimates and may be inaccurate. */
  readonly equipment: ReadonlyArray<Maybe<ContainedItem>>;
  readonly health: Maybe<ReadonlyArray<Maybe<HealthPart>>>;
  readonly id: Scalars["ID"]["output"];
  readonly imagePortraitLink: Maybe<Scalars["String"]["output"]>;
  readonly imagePosterLink: Maybe<Scalars["String"]["output"]>;
  readonly items: ReadonlyArray<Maybe<Item>>;
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Scalars["String"]["output"];
};

export type NumberCompare = {
  readonly __typename?: "NumberCompare";
  readonly compareMethod: Scalars["String"]["output"];
  readonly value: Scalars["Float"]["output"];
};

export type OfferUnlock = {
  readonly __typename?: "OfferUnlock";
  readonly id: Scalars["ID"]["output"];
  readonly item: Item;
  readonly level: Scalars["Int"]["output"];
  readonly trader: Trader;
};

export type PlayerLevel = {
  readonly __typename?: "PlayerLevel";
  readonly exp: Scalars["Int"]["output"];
  readonly level: Scalars["Int"]["output"];
};

export type PriceRequirement = {
  readonly __typename?: "PriceRequirement";
  readonly stringValue: Maybe<Scalars["String"]["output"]>;
  readonly type: RequirementType;
  readonly value: Maybe<Scalars["Int"]["output"]>;
};

export type Query = {
  readonly __typename?: "Query";
  readonly ammo: Maybe<ReadonlyArray<Maybe<Ammo>>>;
  readonly armorMaterials: ReadonlyArray<Maybe<ArmorMaterial>>;
  readonly barters: Maybe<ReadonlyArray<Maybe<Barter>>>;
  readonly bosses: Maybe<ReadonlyArray<Maybe<MobInfo>>>;
  readonly crafts: Maybe<ReadonlyArray<Maybe<Craft>>>;
  readonly fleaMarket: FleaMarket;
  readonly handbookCategories: ReadonlyArray<Maybe<ItemCategory>>;
  /** @deprecated Use hideoutStations instead. */
  readonly hideoutModules: Maybe<ReadonlyArray<Maybe<HideoutModule>>>;
  readonly hideoutStations: ReadonlyArray<Maybe<HideoutStation>>;
  readonly historicalItemPrices: ReadonlyArray<Maybe<HistoricalPricePoint>>;
  readonly item: Maybe<Item>;
  /** @deprecated Use item instead. */
  readonly itemByNormalizedName: Maybe<Item>;
  readonly itemCategories: ReadonlyArray<Maybe<ItemCategory>>;
  readonly items: ReadonlyArray<Maybe<Item>>;
  /** @deprecated Use items instead. */
  readonly itemsByBsgCategoryId: ReadonlyArray<Maybe<Item>>;
  /** @deprecated Use items instead. */
  readonly itemsByIDs: Maybe<ReadonlyArray<Maybe<Item>>>;
  /** @deprecated Use items instead. */
  readonly itemsByName: ReadonlyArray<Maybe<Item>>;
  /** @deprecated Use items instead. */
  readonly itemsByType: ReadonlyArray<Maybe<Item>>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly playerLevels: ReadonlyArray<Maybe<PlayerLevel>>;
  readonly questItems: Maybe<ReadonlyArray<Maybe<QuestItem>>>;
  /** @deprecated Use tasks instead. */
  readonly quests: Maybe<ReadonlyArray<Maybe<Quest>>>;
  readonly status: ServerStatus;
  readonly task: Maybe<Task>;
  readonly tasks: ReadonlyArray<Maybe<Task>>;
  /** @deprecated Use traders instead. */
  readonly traderResetTimes: Maybe<ReadonlyArray<Maybe<TraderResetTime>>>;
  readonly traders: ReadonlyArray<Maybe<Trader>>;
};

export type QueryAmmoArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryArmorMaterialsArgs = {
  lang: InputMaybe<LanguageCode>;
};

export type QueryBartersArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryBossesArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  name: InputMaybe<ReadonlyArray<Scalars["String"]["input"]>>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryCraftsArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryFleaMarketArgs = {
  lang: InputMaybe<LanguageCode>;
};

export type QueryHandbookCategoriesArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryHideoutStationsArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryHistoricalItemPricesArgs = {
  id: Scalars["ID"]["input"];
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryItemArgs = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  lang: InputMaybe<LanguageCode>;
  normalizedName: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryItemByNormalizedNameArgs = {
  normalizedName: Scalars["String"]["input"];
};

export type QueryItemCategoriesArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryItemsArgs = {
  bsgCategory: InputMaybe<Scalars["String"]["input"]>;
  bsgCategoryId: InputMaybe<Scalars["String"]["input"]>;
  bsgCategoryIds: InputMaybe<
    ReadonlyArray<InputMaybe<Scalars["String"]["input"]>>
  >;
  categoryNames: InputMaybe<ReadonlyArray<InputMaybe<ItemCategoryName>>>;
  handbookCategoryNames: InputMaybe<
    ReadonlyArray<InputMaybe<HandbookCategoryName>>
  >;
  ids: InputMaybe<ReadonlyArray<InputMaybe<Scalars["ID"]["input"]>>>;
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  names: InputMaybe<ReadonlyArray<InputMaybe<Scalars["String"]["input"]>>>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
  type: InputMaybe<ItemType>;
  types: InputMaybe<ReadonlyArray<InputMaybe<ItemType>>>;
};

export type QueryItemsByBsgCategoryIdArgs = {
  bsgCategoryId: Scalars["String"]["input"];
};

export type QueryItemsByIDsArgs = {
  ids: ReadonlyArray<InputMaybe<Scalars["ID"]["input"]>>;
};

export type QueryItemsByNameArgs = {
  name: Scalars["String"]["input"];
};

export type QueryItemsByTypeArgs = {
  type: ItemType;
};

export type QueryMapsArgs = {
  enemies: InputMaybe<ReadonlyArray<Scalars["String"]["input"]>>;
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  name: InputMaybe<ReadonlyArray<Scalars["String"]["input"]>>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryQuestItemsArgs = {
  lang: InputMaybe<LanguageCode>;
};

export type QueryTaskArgs = {
  id: Scalars["ID"]["input"];
  lang: InputMaybe<LanguageCode>;
};

export type QueryTasksArgs = {
  faction: InputMaybe<Scalars["String"]["input"]>;
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryTradersArgs = {
  lang: InputMaybe<LanguageCode>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  offset: InputMaybe<Scalars["Int"]["input"]>;
};

/** Quest has been replaced with Task. */
export type Quest = {
  readonly __typename?: "Quest";
  /** @deprecated Use Task type instead. */
  readonly exp: Scalars["Int"]["output"];
  /** @deprecated Use Task type instead. */
  readonly giver: Trader;
  /** @deprecated Use Task type instead. */
  readonly id: Scalars["String"]["output"];
  /** @deprecated Use Task type instead. */
  readonly objectives: ReadonlyArray<Maybe<QuestObjective>>;
  /** @deprecated Use Task type instead. */
  readonly reputation: Maybe<ReadonlyArray<QuestRewardReputation>>;
  /** @deprecated Use Task type instead. */
  readonly requirements: Maybe<QuestRequirement>;
  /** @deprecated Use Task type instead. */
  readonly title: Scalars["String"]["output"];
  /** @deprecated Use Task type instead. */
  readonly turnin: Trader;
  /** @deprecated Use Task type instead. */
  readonly unlocks: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  /** @deprecated Use Task type instead. */
  readonly wikiLink: Scalars["String"]["output"];
};

export type QuestItem = {
  readonly __typename?: "QuestItem";
  readonly baseImageLink: Maybe<Scalars["String"]["output"]>;
  readonly description: Maybe<Scalars["String"]["output"]>;
  readonly gridImageLink: Maybe<Scalars["String"]["output"]>;
  readonly height: Maybe<Scalars["Int"]["output"]>;
  readonly iconLink: Maybe<Scalars["String"]["output"]>;
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly image8xLink: Maybe<Scalars["String"]["output"]>;
  readonly image512pxLink: Maybe<Scalars["String"]["output"]>;
  readonly inspectImageLink: Maybe<Scalars["String"]["output"]>;
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Maybe<Scalars["String"]["output"]>;
  readonly shortName: Maybe<Scalars["String"]["output"]>;
  readonly width: Maybe<Scalars["Int"]["output"]>;
};

/** QuestObjective has been replaced with TaskObjective. */
export type QuestObjective = {
  readonly __typename?: "QuestObjective";
  /** @deprecated Use Task type instead. */
  readonly id: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use Task type instead. */
  readonly location: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use Task type instead. */
  readonly number: Maybe<Scalars["Int"]["output"]>;
  /** @deprecated Use Task type instead. */
  readonly target: Maybe<ReadonlyArray<Scalars["String"]["output"]>>;
  /** @deprecated Use Task type instead. */
  readonly targetItem: Maybe<Item>;
  /** @deprecated Use Task type instead. */
  readonly type: Scalars["String"]["output"];
};

/** QuestRequirement has been replaced with TaskRequirement. */
export type QuestRequirement = {
  readonly __typename?: "QuestRequirement";
  /** @deprecated Use Task type instead. */
  readonly level: Maybe<Scalars["Int"]["output"]>;
  /** @deprecated Use Task type instead. */
  readonly prerequisiteQuests: ReadonlyArray<
    Maybe<ReadonlyArray<Maybe<Quest>>>
  >;
  /** @deprecated Use Task type instead. */
  readonly quests: ReadonlyArray<
    Maybe<ReadonlyArray<Maybe<Scalars["Int"]["output"]>>>
  >;
};

export type QuestRewardReputation = {
  readonly __typename?: "QuestRewardReputation";
  /** @deprecated Use Task type instead. */
  readonly amount: Scalars["Float"]["output"];
  /** @deprecated Use Task type instead. */
  readonly trader: Trader;
};

export type RequirementHideoutStationLevel = {
  readonly __typename?: "RequirementHideoutStationLevel";
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly level: Scalars["Int"]["output"];
  readonly station: HideoutStation;
};

export type RequirementItem = {
  readonly __typename?: "RequirementItem";
  readonly attributes: Maybe<ReadonlyArray<Maybe<ItemAttribute>>>;
  readonly count: Scalars["Int"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly item: Item;
  readonly quantity: Scalars["Int"]["output"];
};

export type RequirementSkill = {
  readonly __typename?: "RequirementSkill";
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly level: Scalars["Int"]["output"];
  readonly name: Scalars["String"]["output"];
};

export type RequirementTask = {
  readonly __typename?: "RequirementTask";
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly task: Task;
};

export type RequirementTrader = {
  readonly __typename?: "RequirementTrader";
  readonly compareMethod: Maybe<Scalars["String"]["output"]>;
  readonly id: Maybe<Scalars["ID"]["output"]>;
  /** @deprecated Use value instead. */
  readonly level: Maybe<Scalars["Int"]["output"]>;
  readonly requirementType: Maybe<Scalars["String"]["output"]>;
  readonly trader: Trader;
  readonly value: Maybe<Scalars["Int"]["output"]>;
};

export type RequirementType =
  | "loyaltyLevel"
  | "playerLevel"
  | "questCompleted"
  | "stationLevel";

export type ServerStatus = {
  readonly __typename?: "ServerStatus";
  readonly currentStatuses: Maybe<ReadonlyArray<Maybe<Status>>>;
  readonly generalStatus: Maybe<Status>;
  readonly messages: Maybe<ReadonlyArray<Maybe<StatusMessage>>>;
};

export type SkillLevel = {
  readonly __typename?: "SkillLevel";
  readonly level: Scalars["Float"]["output"];
  readonly name: Scalars["String"]["output"];
};

export type Status = {
  readonly __typename?: "Status";
  readonly message: Maybe<Scalars["String"]["output"]>;
  readonly name: Scalars["String"]["output"];
  readonly status: Scalars["Int"]["output"];
  readonly statusCode: Scalars["String"]["output"];
};

export type StatusCode = "Down" | "OK" | "Unstable" | "Updating";

export type StatusMessage = {
  readonly __typename?: "StatusMessage";
  readonly content: Scalars["String"]["output"];
  readonly solveTime: Maybe<Scalars["String"]["output"]>;
  readonly statusCode: Scalars["String"]["output"];
  readonly time: Scalars["String"]["output"];
  readonly type: Scalars["Int"]["output"];
};

export type StimEffect = {
  readonly __typename?: "StimEffect";
  readonly chance: Scalars["Float"]["output"];
  readonly delay: Scalars["Int"]["output"];
  readonly duration: Scalars["Int"]["output"];
  readonly percent: Scalars["Boolean"]["output"];
  readonly skillName: Maybe<Scalars["String"]["output"]>;
  readonly type: Scalars["String"]["output"];
  readonly value: Scalars["Float"]["output"];
};

export type Task = {
  readonly __typename?: "Task";
  readonly descriptionMessageId: Maybe<Scalars["String"]["output"]>;
  readonly experience: Scalars["Int"]["output"];
  readonly factionName: Maybe<Scalars["String"]["output"]>;
  readonly failConditions: ReadonlyArray<Maybe<TaskObjective>>;
  readonly failMessageId: Maybe<Scalars["String"]["output"]>;
  readonly failureOutcome: Maybe<TaskRewards>;
  readonly finishRewards: Maybe<TaskRewards>;
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly kappaRequired: Maybe<Scalars["Boolean"]["output"]>;
  readonly lightkeeperRequired: Maybe<Scalars["Boolean"]["output"]>;
  readonly map: Maybe<Map>;
  readonly minPlayerLevel: Maybe<Scalars["Int"]["output"]>;
  readonly name: Scalars["String"]["output"];
  readonly neededKeys: Maybe<ReadonlyArray<Maybe<TaskKey>>>;
  readonly normalizedName: Scalars["String"]["output"];
  readonly objectives: ReadonlyArray<Maybe<TaskObjective>>;
  readonly restartable: Maybe<Scalars["Boolean"]["output"]>;
  readonly startMessageId: Maybe<Scalars["String"]["output"]>;
  readonly startRewards: Maybe<TaskRewards>;
  readonly successMessageId: Maybe<Scalars["String"]["output"]>;
  readonly tarkovDataId: Maybe<Scalars["Int"]["output"]>;
  readonly taskImageLink: Maybe<Scalars["String"]["output"]>;
  readonly taskRequirements: ReadonlyArray<Maybe<TaskStatusRequirement>>;
  readonly trader: Trader;
  /** @deprecated Use traderRequirements instead. */
  readonly traderLevelRequirements: ReadonlyArray<Maybe<RequirementTrader>>;
  readonly traderRequirements: ReadonlyArray<Maybe<RequirementTrader>>;
  readonly wikiLink: Maybe<Scalars["String"]["output"]>;
};

export type TaskKey = {
  readonly __typename?: "TaskKey";
  readonly keys: ReadonlyArray<Maybe<Item>>;
  readonly map: Maybe<Map>;
};

export type TaskObjective = {
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveBasic = TaskObjective & {
  readonly __typename?: "TaskObjectiveBasic";
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveBuildItem = TaskObjective & {
  readonly __typename?: "TaskObjectiveBuildItem";
  readonly attributes: ReadonlyArray<Maybe<AttributeThreshold>>;
  readonly containsAll: ReadonlyArray<Maybe<Item>>;
  readonly containsCategory: ReadonlyArray<Maybe<ItemCategory>>;
  /** @deprecated Use containsCategory instead. */
  readonly containsOne: ReadonlyArray<Maybe<Item>>;
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly item: Item;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveExperience = TaskObjective & {
  readonly __typename?: "TaskObjectiveExperience";
  readonly description: Scalars["String"]["output"];
  readonly healthEffect: HealthEffect;
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveExtract = TaskObjective & {
  readonly __typename?: "TaskObjectiveExtract";
  readonly description: Scalars["String"]["output"];
  readonly exitName: Maybe<Scalars["String"]["output"]>;
  readonly exitStatus: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
  readonly zoneNames: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
};

export type TaskObjectiveItem = TaskObjective & {
  readonly __typename?: "TaskObjectiveItem";
  readonly count: Scalars["Int"]["output"];
  readonly description: Scalars["String"]["output"];
  readonly dogTagLevel: Maybe<Scalars["Int"]["output"]>;
  readonly foundInRaid: Scalars["Boolean"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly item: Item;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly maxDurability: Maybe<Scalars["Int"]["output"]>;
  readonly minDurability: Maybe<Scalars["Int"]["output"]>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveMark = TaskObjective & {
  readonly __typename?: "TaskObjectiveMark";
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly markerItem: Item;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectivePlayerLevel = TaskObjective & {
  readonly __typename?: "TaskObjectivePlayerLevel";
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly playerLevel: Scalars["Int"]["output"];
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveQuestItem = TaskObjective & {
  readonly __typename?: "TaskObjectiveQuestItem";
  readonly count: Scalars["Int"]["output"];
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly questItem: QuestItem;
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveShoot = TaskObjective & {
  readonly __typename?: "TaskObjectiveShoot";
  readonly bodyParts: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  readonly count: Scalars["Int"]["output"];
  readonly description: Scalars["String"]["output"];
  readonly distance: Maybe<NumberCompare>;
  readonly enemyHealthEffect: Maybe<HealthEffect>;
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly notWearing: Maybe<ReadonlyArray<Maybe<Item>>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly playerHealthEffect: Maybe<HealthEffect>;
  readonly shotType: Scalars["String"]["output"];
  /** @deprecated Use targetNames instead. */
  readonly target: Scalars["String"]["output"];
  readonly targetNames: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  readonly timeFromHour: Maybe<Scalars["Int"]["output"]>;
  readonly timeUntilHour: Maybe<Scalars["Int"]["output"]>;
  readonly type: Scalars["String"]["output"];
  readonly usingWeapon: Maybe<ReadonlyArray<Maybe<Item>>>;
  readonly usingWeaponMods: Maybe<
    ReadonlyArray<Maybe<ReadonlyArray<Maybe<Item>>>>
  >;
  readonly wearing: Maybe<ReadonlyArray<Maybe<ReadonlyArray<Maybe<Item>>>>>;
  readonly zoneNames: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
};

export type TaskObjectiveSkill = TaskObjective & {
  readonly __typename?: "TaskObjectiveSkill";
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly skillLevel: SkillLevel;
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveTaskStatus = TaskObjective & {
  readonly __typename?: "TaskObjectiveTaskStatus";
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly status: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  readonly task: Task;
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveTraderLevel = TaskObjective & {
  readonly __typename?: "TaskObjectiveTraderLevel";
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly level: Scalars["Int"]["output"];
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly trader: Trader;
  readonly type: Scalars["String"]["output"];
};

export type TaskObjectiveTraderStanding = TaskObjective & {
  readonly __typename?: "TaskObjectiveTraderStanding";
  readonly compareMethod: Scalars["String"]["output"];
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly trader: Trader;
  readonly type: Scalars["String"]["output"];
  readonly value: Scalars["Int"]["output"];
};

export type TaskObjectiveUseItem = TaskObjective & {
  readonly __typename?: "TaskObjectiveUseItem";
  readonly compareMethod: Scalars["String"]["output"];
  readonly count: Scalars["Int"]["output"];
  readonly description: Scalars["String"]["output"];
  readonly id: Maybe<Scalars["ID"]["output"]>;
  readonly maps: ReadonlyArray<Maybe<Map>>;
  readonly optional: Scalars["Boolean"]["output"];
  readonly type: Scalars["String"]["output"];
  readonly useAny: ReadonlyArray<Maybe<Item>>;
  readonly zoneNames: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
};

export type TaskRewards = {
  readonly __typename?: "TaskRewards";
  readonly craftUnlock: ReadonlyArray<Maybe<Craft>>;
  readonly items: ReadonlyArray<Maybe<ContainedItem>>;
  readonly offerUnlock: ReadonlyArray<Maybe<OfferUnlock>>;
  readonly skillLevelReward: ReadonlyArray<Maybe<SkillLevel>>;
  readonly traderStanding: ReadonlyArray<Maybe<TraderStanding>>;
  readonly traderUnlock: ReadonlyArray<Maybe<Trader>>;
};

export type TaskStatusRequirement = {
  readonly __typename?: "TaskStatusRequirement";
  readonly status: ReadonlyArray<Maybe<Scalars["String"]["output"]>>;
  readonly task: Task;
};

export type Trader = {
  readonly __typename?: "Trader";
  /** barters and cashOffers are only available via the traders query. */
  readonly barters: ReadonlyArray<Maybe<Barter>>;
  readonly cashOffers: ReadonlyArray<Maybe<TraderCashOffer>>;
  readonly currency: Item;
  readonly description: Maybe<Scalars["String"]["output"]>;
  readonly discount: Scalars["Float"]["output"];
  readonly id: Scalars["ID"]["output"];
  readonly image4xLink: Maybe<Scalars["String"]["output"]>;
  readonly imageLink: Maybe<Scalars["String"]["output"]>;
  readonly levels: ReadonlyArray<TraderLevel>;
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Scalars["String"]["output"];
  readonly reputationLevels: ReadonlyArray<Maybe<TraderReputationLevel>>;
  readonly resetTime: Maybe<Scalars["String"]["output"]>;
  readonly tarkovDataId: Maybe<Scalars["Int"]["output"]>;
};

export type TraderCashOffer = {
  readonly __typename?: "TraderCashOffer";
  readonly currency: Maybe<Scalars["String"]["output"]>;
  readonly currencyItem: Maybe<Item>;
  readonly item: Item;
  readonly minTraderLevel: Maybe<Scalars["Int"]["output"]>;
  readonly price: Maybe<Scalars["Int"]["output"]>;
  readonly priceRUB: Maybe<Scalars["Int"]["output"]>;
  readonly taskUnlock: Maybe<Task>;
};

export type TraderLevel = {
  readonly __typename?: "TraderLevel";
  /** barters and cashOffers are only available via the traders query. */
  readonly barters: ReadonlyArray<Maybe<Barter>>;
  readonly cashOffers: ReadonlyArray<Maybe<TraderCashOffer>>;
  readonly id: Scalars["ID"]["output"];
  readonly image4xLink: Maybe<Scalars["String"]["output"]>;
  readonly imageLink: Maybe<Scalars["String"]["output"]>;
  readonly insuranceRate: Maybe<Scalars["Float"]["output"]>;
  readonly level: Scalars["Int"]["output"];
  readonly payRate: Scalars["Float"]["output"];
  readonly repairCostMultiplier: Maybe<Scalars["Float"]["output"]>;
  readonly requiredCommerce: Scalars["Int"]["output"];
  readonly requiredPlayerLevel: Scalars["Int"]["output"];
  readonly requiredReputation: Scalars["Float"]["output"];
};

export type TraderName =
  | "fence"
  | "jaeger"
  | "mechanic"
  | "peacekeeper"
  | "prapor"
  | "ragman"
  | "skier"
  | "therapist";

export type TraderOffer = Vendor & {
  readonly __typename?: "TraderOffer";
  readonly minTraderLevel: Maybe<Scalars["Int"]["output"]>;
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Scalars["String"]["output"];
  readonly taskUnlock: Maybe<Task>;
  readonly trader: Trader;
};

/** TraderPrice is deprecated and replaced with ItemPrice. */
export type TraderPrice = {
  readonly __typename?: "TraderPrice";
  /** @deprecated Use item.buyFor instead. */
  readonly currency: Scalars["String"]["output"];
  /** @deprecated Use item.buyFor instead. */
  readonly price: Scalars["Int"]["output"];
  /** @deprecated Use item.buyFor instead. */
  readonly priceRUB: Scalars["Int"]["output"];
  /** @deprecated Use item.buyFor instead. */
  readonly trader: Trader;
};

export type TraderReputationLevel = TraderReputationLevelFence;

export type TraderReputationLevelFence = {
  readonly __typename?: "TraderReputationLevelFence";
  readonly availableScavExtracts: Maybe<Scalars["Int"]["output"]>;
  readonly extractPriceModifier: Maybe<Scalars["Float"]["output"]>;
  readonly hostileBosses: Maybe<Scalars["Boolean"]["output"]>;
  readonly hostileScavs: Maybe<Scalars["Boolean"]["output"]>;
  readonly minimumReputation: Scalars["Int"]["output"];
  readonly priceModifier: Maybe<Scalars["Float"]["output"]>;
  readonly scavAttackSupport: Maybe<Scalars["Boolean"]["output"]>;
  readonly scavCaseTimeModifier: Maybe<Scalars["Float"]["output"]>;
  readonly scavCooldownModifier: Maybe<Scalars["Float"]["output"]>;
  readonly scavEquipmentSpawnChanceModifier: Maybe<Scalars["Float"]["output"]>;
  readonly scavFollowChance: Maybe<Scalars["Float"]["output"]>;
};

/** TraderResetTime is deprecated and replaced with Trader. */
export type TraderResetTime = {
  readonly __typename?: "TraderResetTime";
  /** @deprecated Use Trader.name type instead. */
  readonly name: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use Trader.resetTime type instead. */
  readonly resetTimestamp: Maybe<Scalars["String"]["output"]>;
};

export type TraderStanding = {
  readonly __typename?: "TraderStanding";
  readonly standing: Scalars["Float"]["output"];
  readonly trader: Trader;
};

export type Vendor = {
  readonly name: Scalars["String"]["output"];
  readonly normalizedName: Scalars["String"]["output"];
};

export type HistoricalPricePoint = {
  readonly __typename?: "historicalPricePoint";
  readonly price: Maybe<Scalars["Int"]["output"]>;
  readonly timestamp: Maybe<Scalars["String"]["output"]>;
};

export type AllQueryVariables = Exact<{ [key: string]: never }>;

export type AllQuery = {
  readonly __typename?: "Query";
  readonly playerLevels: ReadonlyArray<{
    readonly __typename?: "PlayerLevel";
    readonly exp: number;
    readonly level: number;
  }>;
  readonly barters: ReadonlyArray<{
    readonly __typename?: "Barter";
    readonly id: string;
    readonly level: number;
    readonly trader: { readonly __typename?: "Trader"; readonly id: string };
    readonly requiredItems: ReadonlyArray<{
      readonly __typename?: "ContainedItem";
      readonly count: number;
      readonly item: {
        readonly __typename?: "Item";
        readonly id: string;
        readonly name: string;
      };
      readonly attributes: ReadonlyArray<{
        readonly __typename?: "ItemAttribute";
        readonly type: string;
        readonly name: string;
        readonly value: string;
      }>;
    }>;
    readonly rewardItems: ReadonlyArray<{
      readonly __typename?: "ContainedItem";
      readonly count: number;
      readonly item: {
        readonly __typename?: "Item";
        readonly id: string;
        readonly name: string;
      };
      readonly attributes: ReadonlyArray<{
        readonly __typename?: "ItemAttribute";
        readonly type: string;
        readonly name: string;
        readonly value: string;
      }>;
    }>;
  }>;
  readonly traders: ReadonlyArray<{
    readonly __typename?: "Trader";
    readonly normalizedName: string;
    readonly id: string;
  }>;
  readonly items: ReadonlyArray<{
    readonly __typename?: "Item";
    readonly id: string;
    readonly name: string;
    readonly shortName: string;
    readonly image512pxLink: string;
    readonly types: ReadonlyArray<ItemType>;
    readonly width: number;
    readonly height: number;
    readonly wikiLink: string;
    readonly avg24hPrice: number;
    readonly sellFor: ReadonlyArray<{
      readonly __typename?: "ItemPrice";
      readonly price: number;
      readonly priceRUB: number;
      readonly vendor:
        | {
            readonly __typename?: "FleaMarket";
            readonly normalizedName: string;
          }
        | {
            readonly __typename?: "TraderOffer";
            readonly normalizedName: string;
          };
    }>;
    readonly buyFor: ReadonlyArray<{
      readonly __typename?: "ItemPrice";
      readonly price: number;
      readonly priceRUB: number;
      readonly vendor:
        | {
            readonly __typename?: "FleaMarket";
            readonly normalizedName: string;
          }
        | {
            readonly __typename?: "TraderOffer";
            readonly normalizedName: string;
          };
    }>;
    readonly properties:
      | {
          readonly __typename: "ItemPropertiesAmmo";
          readonly caliber: string;
          readonly stackMaxSize: number;
          readonly tracer: boolean;
          readonly tracerColor: string;
          readonly ammoType: string;
          readonly projectileCount: number;
          readonly damage: number;
          readonly armorDamage: number;
          readonly fragmentationChance: number;
          readonly penetrationPower: number;
          readonly accuracyModifier: number;
          readonly recoilModifier: number;
          readonly initialSpeed: number;
          readonly lightBleedModifier: number;
          readonly heavyBleedModifier: number;
          readonly durabilityBurnFactor: number;
          readonly heatFactor: number;
        }
      | {
          readonly __typename: "ItemPropertiesArmor";
          readonly class: number;
          readonly durability: number;
          readonly speedPenalty: number;
          readonly turnPenalty: number;
          readonly ergoPenalty: number;
          readonly zones: ReadonlyArray<string>;
          readonly material: {
            readonly __typename?: "ArmorMaterial";
            readonly name: string;
          };
        }
      | {
          readonly __typename: "ItemPropertiesArmorAttachment";
          readonly class: number;
          readonly durability: number;
          readonly speedPenalty: number;
          readonly turnPenalty: number;
          readonly ergoPenalty: number;
          readonly headZones: ReadonlyArray<string>;
          readonly blindnessProtection: number;
          readonly material: {
            readonly __typename?: "ArmorMaterial";
            readonly destructibility: number;
            readonly name: string;
          };
        }
      | {
          readonly __typename: "ItemPropertiesBackpack";
          readonly capacity: number;
          readonly grids: ReadonlyArray<{
            readonly __typename?: "ItemStorageGrid";
            readonly width: number;
            readonly height: number;
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesBarrel";
          readonly ergonomics: number;
          readonly recoilModifier: number;
          readonly slots: ReadonlyArray<{
            readonly __typename?: "ItemSlot";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesChestRig";
          readonly class: number;
          readonly durability: number;
          readonly speedPenalty: number;
          readonly turnPenalty: number;
          readonly ergoPenalty: number;
          readonly zones: ReadonlyArray<string>;
          readonly capacity: number;
          readonly material: {
            readonly __typename?: "ArmorMaterial";
            readonly destructibility: number;
            readonly name: string;
          };
          readonly grids: ReadonlyArray<{
            readonly __typename?: "ItemStorageGrid";
            readonly width: number;
            readonly height: number;
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesContainer";
          readonly capacity: number;
          readonly grids: ReadonlyArray<{
            readonly __typename?: "ItemStorageGrid";
            readonly width: number;
            readonly height: number;
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesFoodDrink";
          readonly energy: number;
          readonly hydration: number;
          readonly units: number;
          readonly stimEffects: ReadonlyArray<{
            readonly __typename?: "StimEffect";
            readonly type: string;
            readonly chance: number;
            readonly delay: number;
            readonly duration: number;
            readonly value: number;
            readonly percent: boolean;
            readonly skillName: string;
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesGlasses";
          readonly class: number;
          readonly durability: number;
          readonly blindnessProtection: number;
          readonly material: {
            readonly __typename?: "ArmorMaterial";
            readonly destructibility: number;
            readonly name: string;
          };
        }
      | {
          readonly __typename: "ItemPropertiesGrenade";
          readonly type: string;
          readonly fuse: number;
          readonly minExplosionDistance: number;
          readonly maxExplosionDistance: number;
          readonly fragments: number;
          readonly contusionRadius: number;
        }
      | { readonly __typename: "ItemPropertiesHeadphone" }
      | {
          readonly __typename: "ItemPropertiesHelmet";
          readonly class: number;
          readonly durability: number;
          readonly speedPenalty: number;
          readonly turnPenalty: number;
          readonly ergoPenalty: number;
          readonly headZones: ReadonlyArray<string>;
          readonly deafening: string;
          readonly blocksHeadset: boolean;
          readonly material: {
            readonly __typename?: "ArmorMaterial";
            readonly destructibility: number;
            readonly name: string;
          };
          readonly slots: ReadonlyArray<{
            readonly __typename?: "ItemSlot";
            readonly name: string;
          }>;
        }
      | { readonly __typename: "ItemPropertiesKey"; readonly uses: number }
      | {
          readonly __typename: "ItemPropertiesMagazine";
          readonly ergonomics: number;
          readonly recoilModifier: number;
          readonly capacity: number;
          readonly loadModifier: number;
          readonly ammoCheckModifier: number;
          readonly malfunctionChance: number;
          readonly allowedAmmo: ReadonlyArray<{
            readonly __typename?: "Item";
            readonly properties:
              | {
                  readonly __typename?: "ItemPropertiesAmmo";
                  readonly caliber: string;
                }
              | { readonly __typename?: "ItemPropertiesArmor" }
              | { readonly __typename?: "ItemPropertiesArmorAttachment" }
              | { readonly __typename?: "ItemPropertiesBackpack" }
              | { readonly __typename?: "ItemPropertiesBarrel" }
              | { readonly __typename?: "ItemPropertiesChestRig" }
              | { readonly __typename?: "ItemPropertiesContainer" }
              | { readonly __typename?: "ItemPropertiesFoodDrink" }
              | { readonly __typename?: "ItemPropertiesGlasses" }
              | { readonly __typename?: "ItemPropertiesGrenade" }
              | { readonly __typename?: "ItemPropertiesHeadphone" }
              | { readonly __typename?: "ItemPropertiesHelmet" }
              | { readonly __typename?: "ItemPropertiesKey" }
              | { readonly __typename?: "ItemPropertiesMagazine" }
              | { readonly __typename?: "ItemPropertiesMedKit" }
              | { readonly __typename?: "ItemPropertiesMedicalItem" }
              | { readonly __typename?: "ItemPropertiesMelee" }
              | { readonly __typename?: "ItemPropertiesNightVision" }
              | { readonly __typename?: "ItemPropertiesPainkiller" }
              | { readonly __typename?: "ItemPropertiesPreset" }
              | { readonly __typename?: "ItemPropertiesResource" }
              | { readonly __typename?: "ItemPropertiesScope" }
              | { readonly __typename?: "ItemPropertiesStim" }
              | { readonly __typename?: "ItemPropertiesSurgicalKit" }
              | { readonly __typename?: "ItemPropertiesWeapon" }
              | { readonly __typename?: "ItemPropertiesWeaponMod" };
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesMedKit";
          readonly hitpoints: number;
          readonly useTime: number;
          readonly maxHealPerUse: number;
          readonly cures: ReadonlyArray<string>;
          readonly hpCostLightBleeding: number;
          readonly hpCostHeavyBleeding: number;
        }
      | {
          readonly __typename: "ItemPropertiesMedicalItem";
          readonly uses: number;
          readonly useTime: number;
          readonly cures: ReadonlyArray<string>;
        }
      | {
          readonly __typename: "ItemPropertiesMelee";
          readonly slashDamage: number;
          readonly stabDamage: number;
          readonly hitRadius: number;
        }
      | {
          readonly __typename: "ItemPropertiesNightVision";
          readonly intensity: number;
          readonly noiseIntensity: number;
          readonly noiseScale: number;
          readonly diffuseIntensity: number;
        }
      | {
          readonly __typename: "ItemPropertiesPainkiller";
          readonly uses: number;
          readonly useTime: number;
          readonly cures: ReadonlyArray<string>;
          readonly painkillerDuration: number;
          readonly energyImpact: number;
          readonly hydrationImpact: number;
        }
      | { readonly __typename: "ItemPropertiesPreset" }
      | { readonly __typename: "ItemPropertiesResource" }
      | {
          readonly __typename: "ItemPropertiesScope";
          readonly ergonomics: number;
          readonly sightModes: ReadonlyArray<number>;
          readonly sightingRange: number;
          readonly recoilModifier: number;
          readonly zoomLevels: ReadonlyArray<ReadonlyArray<number>>;
          readonly slots: ReadonlyArray<{
            readonly __typename?: "ItemSlot";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesStim";
          readonly useTime: number;
          readonly cures: ReadonlyArray<string>;
          readonly stimEffects: ReadonlyArray<{
            readonly __typename?: "StimEffect";
            readonly type: string;
            readonly chance: number;
            readonly delay: number;
            readonly duration: number;
            readonly value: number;
            readonly percent: boolean;
            readonly skillName: string;
          }>;
        }
      | {
          readonly __typename: "ItemPropertiesSurgicalKit";
          readonly uses: number;
          readonly useTime: number;
          readonly cures: ReadonlyArray<string>;
          readonly minLimbHealth: number;
          readonly maxLimbHealth: number;
        }
      | {
          readonly __typename: "ItemPropertiesWeapon";
          readonly caliber: string;
          readonly effectiveDistance: number;
          readonly fireModes: ReadonlyArray<string>;
          readonly fireRate: number;
          readonly maxDurability: number;
          readonly defaultAmmo: {
            readonly __typename?: "Item";
            readonly id: string;
            readonly shortName: string;
          };
          readonly defaultPreset: {
            readonly __typename?: "Item";
            readonly properties:
              | { readonly __typename?: "ItemPropertiesAmmo" }
              | { readonly __typename?: "ItemPropertiesArmor" }
              | { readonly __typename?: "ItemPropertiesArmorAttachment" }
              | { readonly __typename?: "ItemPropertiesBackpack" }
              | { readonly __typename?: "ItemPropertiesBarrel" }
              | { readonly __typename?: "ItemPropertiesChestRig" }
              | { readonly __typename?: "ItemPropertiesContainer" }
              | { readonly __typename?: "ItemPropertiesFoodDrink" }
              | { readonly __typename?: "ItemPropertiesGlasses" }
              | { readonly __typename?: "ItemPropertiesGrenade" }
              | { readonly __typename?: "ItemPropertiesHeadphone" }
              | { readonly __typename?: "ItemPropertiesHelmet" }
              | { readonly __typename?: "ItemPropertiesKey" }
              | { readonly __typename?: "ItemPropertiesMagazine" }
              | { readonly __typename?: "ItemPropertiesMedKit" }
              | { readonly __typename?: "ItemPropertiesMedicalItem" }
              | { readonly __typename?: "ItemPropertiesMelee" }
              | { readonly __typename?: "ItemPropertiesNightVision" }
              | { readonly __typename?: "ItemPropertiesPainkiller" }
              | {
                  readonly __typename?: "ItemPropertiesPreset";
                  readonly ergonomics: number;
                  readonly recoilVertical: number;
                  readonly recoilHorizontal: number;
                  readonly moa: number;
                }
              | { readonly __typename?: "ItemPropertiesResource" }
              | { readonly __typename?: "ItemPropertiesScope" }
              | { readonly __typename?: "ItemPropertiesStim" }
              | { readonly __typename?: "ItemPropertiesSurgicalKit" }
              | { readonly __typename?: "ItemPropertiesWeapon" }
              | { readonly __typename?: "ItemPropertiesWeaponMod" };
          };
        }
      | {
          readonly __typename: "ItemPropertiesWeaponMod";
          readonly ergonomics: number;
          readonly recoilModifier: number;
          readonly accuracyModifier: number;
          readonly slots: ReadonlyArray<{
            readonly __typename?: "ItemSlot";
            readonly name: string;
          }>;
        };
  }>;
  readonly tasks: ReadonlyArray<{
    readonly __typename?: "Task";
    readonly id: string;
    readonly tarkovDataId: number;
    readonly name: string;
    readonly experience: number;
    readonly wikiLink: string;
    readonly minPlayerLevel: number;
    readonly trader: { readonly __typename?: "Trader"; readonly id: string };
    readonly map: { readonly __typename?: "Map"; readonly name: string };
    readonly taskRequirements: ReadonlyArray<{
      readonly __typename?: "TaskStatusRequirement";
      readonly status: ReadonlyArray<string>;
      readonly task: { readonly __typename?: "Task"; readonly name: string };
    }>;
    readonly traderLevelRequirements: ReadonlyArray<{
      readonly __typename?: "RequirementTrader";
      readonly id: string;
      readonly level: number;
      readonly trader: { readonly __typename?: "Trader"; readonly id: string };
    }>;
    readonly objectives: ReadonlyArray<
      | {
          readonly __typename: "TaskObjectiveBasic";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveBuildItem";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveExperience";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveExtract";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveItem";
          readonly id: string;
          readonly count: number;
          readonly foundInRaid: boolean;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly item: {
            readonly __typename?: "Item";
            readonly id: string;
            readonly name: string;
          };
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveMark";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectivePlayerLevel";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveQuestItem";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveShoot";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveSkill";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveTaskStatus";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveTraderLevel";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveTraderStanding";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
      | {
          readonly __typename: "TaskObjectiveUseItem";
          readonly id: string;
          readonly type: string;
          readonly description: string;
          readonly optional: boolean;
          readonly maps: ReadonlyArray<{
            readonly __typename?: "Map";
            readonly name: string;
          }>;
        }
    >;
    readonly startRewards: {
      readonly __typename?: "TaskRewards";
      readonly items: ReadonlyArray<{
        readonly __typename?: "ContainedItem";
        readonly count: number;
        readonly item: {
          readonly __typename?: "Item";
          readonly id: string;
          readonly name: string;
        };
      }>;
      readonly offerUnlock: ReadonlyArray<{
        readonly __typename?: "OfferUnlock";
        readonly level: number;
        readonly trader: {
          readonly __typename?: "Trader";
          readonly id: string;
        };
        readonly item: {
          readonly __typename?: "Item";
          readonly id: string;
          readonly name: string;
        };
      }>;
      readonly traderUnlock: ReadonlyArray<{
        readonly __typename?: "Trader";
        readonly id: string;
      }>;
    };
    readonly finishRewards: {
      readonly __typename?: "TaskRewards";
      readonly items: ReadonlyArray<{
        readonly __typename?: "ContainedItem";
        readonly count: number;
        readonly item: {
          readonly __typename?: "Item";
          readonly id: string;
          readonly name: string;
        };
      }>;
      readonly offerUnlock: ReadonlyArray<{
        readonly __typename?: "OfferUnlock";
        readonly level: number;
        readonly trader: {
          readonly __typename?: "Trader";
          readonly id: string;
        };
        readonly item: {
          readonly __typename?: "Item";
          readonly id: string;
          readonly name: string;
        };
      }>;
      readonly traderUnlock: ReadonlyArray<{
        readonly __typename?: "Trader";
        readonly id: string;
      }>;
    };
  }>;
};

export type TraderRestocksQueryVariables = Exact<{ [key: string]: never }>;

export type TraderRestocksQuery = {
  readonly __typename?: "Query";
  readonly traders: ReadonlyArray<{
    readonly __typename?: "Trader";
    readonly id: string;
    readonly resetTime: string;
  }>;
};

export type ServerStatusQueryVariables = Exact<{ [key: string]: never }>;

export type ServerStatusQuery = {
  readonly __typename?: "Query";
  readonly status: {
    readonly __typename?: "ServerStatus";
    readonly currentStatuses: ReadonlyArray<{
      readonly __typename?: "Status";
      readonly name: string;
      readonly statusCode: string;
    }>;
    readonly generalStatus: {
      readonly __typename?: "Status";
      readonly name: string;
      readonly message: string;
      readonly status: number;
      readonly statusCode: string;
    };
  };
};

export const AllDocument = gql`
  query all {
    playerLevels {
      exp
      level
    }
    barters {
      id
      trader {
        id
      }
      level
      requiredItems {
        count
        item {
          id
          name
        }
        attributes {
          type
          name
          value
        }
      }
      rewardItems {
        count
        item {
          id
          name
        }
        attributes {
          type
          name
          value
        }
      }
    }
    traders {
      normalizedName
      id
    }
    items {
      id
      name
      shortName
      image512pxLink
      types
      width
      height
      wikiLink
      avg24hPrice
      sellFor {
        vendor {
          normalizedName
        }
        price
        priceRUB
      }
      buyFor {
        vendor {
          normalizedName
        }
        price
        priceRUB
      }
      properties {
        __typename
        ... on ItemPropertiesAmmo {
          caliber
          stackMaxSize
          tracer
          tracerColor
          ammoType
          projectileCount
          damage
          armorDamage
          fragmentationChance
          penetrationPower
          accuracyModifier
          recoilModifier
          initialSpeed
          lightBleedModifier
          heavyBleedModifier
          durabilityBurnFactor
          heatFactor
        }
        ... on ItemPropertiesArmor {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          zones
          material {
            name
          }
        }
        ... on ItemPropertiesArmorAttachment {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          material {
            destructibility
            name
          }
          headZones
          blindnessProtection
        }
        ... on ItemPropertiesBackpack {
          capacity
          grids {
            width
            height
          }
        }
        ... on ItemPropertiesBarrel {
          ergonomics
          recoilModifier
          slots {
            name
          }
        }
        ... on ItemPropertiesChestRig {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          zones
          material {
            destructibility
            name
          }
          capacity
          grids {
            width
            height
          }
        }
        ... on ItemPropertiesContainer {
          capacity
          grids {
            width
            height
          }
        }
        ... on ItemPropertiesFoodDrink {
          energy
          hydration
          units
          stimEffects {
            type
            chance
            delay
            duration
            value
            percent
            skillName
          }
        }
        ... on ItemPropertiesGlasses {
          class
          durability
          blindnessProtection
          material {
            destructibility
            name
          }
        }
        ... on ItemPropertiesGrenade {
          type
          fuse
          minExplosionDistance
          maxExplosionDistance
          fragments
          contusionRadius
        }
        ... on ItemPropertiesHelmet {
          class
          durability
          speedPenalty
          turnPenalty
          ergoPenalty
          headZones
          material {
            destructibility
            name
          }
          deafening
          blocksHeadset
          slots {
            name
          }
        }
        ... on ItemPropertiesKey {
          uses
        }
        ... on ItemPropertiesMagazine {
          ergonomics
          recoilModifier
          capacity
          loadModifier
          ammoCheckModifier
          malfunctionChance
          allowedAmmo {
            properties {
              ... on ItemPropertiesAmmo {
                caliber
              }
            }
          }
        }
        ... on ItemPropertiesMedicalItem {
          uses
          useTime
          cures
        }
        ... on ItemPropertiesMelee {
          slashDamage
          stabDamage
          hitRadius
        }
        ... on ItemPropertiesMedKit {
          hitpoints
          useTime
          maxHealPerUse
          cures
          hpCostLightBleeding
          hpCostHeavyBleeding
        }
        ... on ItemPropertiesNightVision {
          intensity
          noiseIntensity
          noiseScale
          diffuseIntensity
        }
        ... on ItemPropertiesPainkiller {
          uses
          useTime
          cures
          painkillerDuration
          energyImpact
          hydrationImpact
        }
        ... on ItemPropertiesScope {
          ergonomics
          sightModes
          sightingRange
          recoilModifier
          slots {
            name
          }
          zoomLevels
        }
        ... on ItemPropertiesSurgicalKit {
          uses
          useTime
          cures
          minLimbHealth
          maxLimbHealth
        }
        ... on ItemPropertiesWeapon {
          caliber
          defaultAmmo {
            id
            shortName
          }
          effectiveDistance
          fireModes
          fireRate
          maxDurability
          defaultPreset {
            properties {
              ... on ItemPropertiesPreset {
                ergonomics
                recoilVertical
                recoilHorizontal
                moa
              }
            }
          }
        }
        ... on ItemPropertiesWeaponMod {
          ergonomics
          recoilModifier
          accuracyModifier
          slots {
            name
          }
        }
        ... on ItemPropertiesStim {
          useTime
          cures
          stimEffects {
            type
            chance
            delay
            duration
            value
            percent
            skillName
          }
        }
      }
    }
    tasks {
      id
      tarkovDataId
      name
      trader {
        id
      }
      map {
        name
      }
      experience
      wikiLink
      minPlayerLevel
      taskRequirements {
        task {
          name
        }
        status
      }
      traderLevelRequirements {
        id
        trader {
          id
        }
        level
      }
      objectives {
        __typename
        id
        type
        description
        maps {
          name
        }
        optional
        ... on TaskObjectiveItem {
          id
          item {
            id
            name
          }
          count
          foundInRaid
        }
      }
      startRewards {
        items {
          item {
            id
            name
          }
          count
        }
        offerUnlock {
          trader {
            id
          }
          level
          item {
            id
            name
          }
        }
        traderUnlock {
          id
        }
      }
      finishRewards {
        items {
          item {
            id
            name
          }
          count
        }
        offerUnlock {
          trader {
            id
          }
          level
          item {
            id
            name
          }
        }
        traderUnlock {
          id
        }
      }
    }
  }
`;
export const TraderRestocksDocument = gql`
  query traderRestocks {
    traders {
      id
      resetTime
    }
  }
`;
export const ServerStatusDocument = gql`
  query serverStatus {
    status {
      currentStatuses {
        name
        statusCode
      }
      generalStatus {
        name
        message
        status
        statusCode
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    all(
      variables?: AllQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<AllQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AllQuery>(AllDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "all",
        "query"
      );
    },
    traderRestocks(
      variables?: TraderRestocksQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<TraderRestocksQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<TraderRestocksQuery>(
            TraderRestocksDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "traderRestocks",
        "query"
      );
    },
    serverStatus(
      variables?: ServerStatusQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<ServerStatusQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ServerStatusQuery>(ServerStatusDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "serverStatus",
        "query"
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
