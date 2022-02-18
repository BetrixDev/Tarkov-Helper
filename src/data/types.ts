type Maybe<T> = T | null
type InputMaybe<T> = Maybe<T>
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }

/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
}

enum TraderName {
    Prapor = 'prapor',
    Therapist = 'therapist',
    Fence = 'fence',
    Skier = 'skier',
    Peacekeeper = 'peacekeeper',
    Mechanic = 'mechanic',
    Ragman = 'ragman',
    Jaeger = 'jaeger'
}

enum ItemSourceName {
    Prapor = 'prapor',
    Therapist = 'therapist',
    Fence = 'fence',
    Skier = 'skier',
    Peacekeeper = 'peacekeeper',
    Mechanic = 'mechanic',
    Ragman = 'ragman',
    Jaeger = 'jaeger',
    FleaMarket = 'fleaMarket'
}

enum RequirementType {
    PlayerLevel = 'playerLevel',
    LoyaltyLevel = 'loyaltyLevel',
    QuestCompleted = 'questCompleted'
}

enum StatusCode {
    Ok = 'OK',
    Updating = 'Updating',
    Unstable = 'Unstable',
    Down = 'Down'
}

enum LanguageCode {
    En = 'en'
}

type GameProperty = {
    __typename?: 'GameProperty'
    key: Scalars['String']
    numericValue?: Maybe<Scalars['Float']>
    stringValue?: Maybe<Scalars['String']>
    arrayValue?: Maybe<Array<Maybe<Scalars['String']>>>
    objectValue?: Maybe<Scalars['String']>
}

type TarkovToolsItem = {
    id: string
    shortName: string
    name: string
    updated: string
    width: number
    height: number
    wikiLink: string
    imageLink: string
    imageLinkFallback: string
    gridImageLink: string
    gridImageLinkFallback: string
    types: Array<TarkovToolsItemType>
    avg24hPrice: number
    traderPrices: Array<TraderPrice>
    lastLowPrice: number
    changeLast48hPercent: number
    sellFor: Array<ItemPrice>
    buyFor: Array<ItemPrice>
}

type ItemTranslationArgs = {
    languageCode?: InputMaybe<LanguageCode>
}

type ItemPrice = {
    __typename?: 'ItemPrice'
    source: string | ItemSourceName
    price: number
    requirements: PriceRequirement[]
}

type ItemTranslation = {
    __typename?: 'ItemTranslation'
    name?: Maybe<Scalars['String']>
    shortName?: Maybe<Scalars['String']>
    description?: Maybe<Scalars['String']>
}

type HistoricalPricePoint = {
    __typename?: 'historicalPricePoint'
    price?: Maybe<Scalars['Int']>
    timestamp?: Maybe<Scalars['String']>
}

type PriceRequirement = {
    __typename?: 'PriceRequirement'
    type: string | RequirementType
    value: Scalars['Int']
}

type ContainedItem = {
    __typename?: 'ContainedItem'
    item: TarkovToolsItem
    count: Scalars['Float']
}

type RawBarter = {
    __typename?: 'Barter'
    source: Scalars['String']
    requiredItems: Array<ContainedItem>
    rewardItems: Array<ContainedItem>
}

type Craft = {
    __typename?: 'Craft'
    source: Scalars['String']
    duration: Scalars['Int']
    requiredItems: Array<Maybe<ContainedItem>>
    rewardItems: Array<Maybe<ContainedItem>>
}

type Trader = {
    __typename?: 'Trader'
    id: Scalars['String']
    name: Scalars['String']
}

type TraderInventory = {
    __typename?: 'TraderInventory'
    id: Scalars['String']
    name: TraderName
    items?: Maybe<Array<TraderInventoryItem>>
}

type TraderInventoryItem = {
    __typename?: 'TraderInventoryItem'
    item: TarkovToolsItem
    minLevel?: Maybe<Scalars['Int']>
    price?: Maybe<Scalars['Int']>
    updated?: Maybe<Scalars['String']>
    questUnlockId?: Maybe<Scalars['String']>
    currency?: Maybe<Scalars['String']>
}

type TraderPrice = {
    __typename?: 'TraderPrice'
    price: Scalars['Int']
    trader: Trader
}

type HideoutModule = {
    __typename?: 'HideoutModule'
    id: number
    name: string
    level: number
    itemRequirements: Array<ContainedItem>
    moduleRequirements: Array<HideoutModule>
}

type Status = {
    __typename?: 'Status'
    name: Scalars['String']
    message?: Maybe<Scalars['String']>
    status: Scalars['Int']
    statusCode: Scalars['String']
}

type StatusMessage = {
    __typename?: 'StatusMessage'
    content: Scalars['String']
    time: Scalars['String']
    type: Scalars['Int']
    solveTime?: Maybe<Scalars['String']>
    statusCode: Scalars['String']
}

type ServerStatus = {
    __typename?: 'ServerStatus'
    generalStatus?: Maybe<Status>
    currentStatuses?: Maybe<Array<Maybe<Status>>>
    messages?: Maybe<Array<Maybe<StatusMessage>>>
}

type TraderResetTime = {
    __typename?: 'TraderResetTime'
    name?: Maybe<Scalars['String']>
    resetTimestamp?: Maybe<Scalars['String']>
}

interface RawProps {
    _id: string
    _name: string
    _parent: string
    _type: Type
    _props: RawItemProps
    _proto?: string
}

interface RawItemProps {
    Name?: string
    ShortName?: string
    Description?: string
    Weight?: number
    BackgroundColor?: BackgroundColor
    Width?: number
    Height?: number
    StackMaxSize?: number
    ItemSound?: ItemSound
    Prefab?: Prefab
    UsePrefab?: Prefab
    StackObjectsCount?: number
    NotShownInSlot?: boolean
    ExaminedByDefault?: boolean
    ExamineTime?: number
    IsUndiscardable?: boolean
    IsUnsaleable?: boolean
    IsUnbuyable?: boolean
    IsUngivable?: boolean
    IsLockedafterEquip?: boolean
    QuestItem?: boolean
    LootExperience?: number
    ExamineExperience?: number
    HideEntrails?: boolean
    RepairCost?: number
    RepairSpeed?: number
    ExtraSizeLeft?: number
    ExtraSizeRight?: number
    ExtraSizeUp?: number
    ExtraSizeDown?: number
    ExtraSizeForceAdd?: boolean
    MergesWithChildren?: boolean
    CanSellOnRagfair?: boolean
    CanRequireOnRagfair?: boolean
    ConflictingItems?: string[]
    Unlootable?: boolean
    UnlootableFromSlot?: UnlootableFromSlot
    UnlootableFromSide?: UnlootableFromSide[]
    AnimationVariantsNumber?: number
    DiscardingBlock?: boolean
    RagFairCommissionModifier?: number
    IsAlwaysAvailableForInsurance?: boolean
    MaxResource?: number
    Resource?: number
    DogTagQualities?: boolean
    Grids?: Grid[]
    Slots?: Slot[]
    CanPutIntoDuringTheRaid?: boolean
    CantRemoveFromSlotsDuringRaid?: string[]
    KeyIds?: string[]
    TagColor?: number
    TagName?: string
    Durability?: number
    Accuracy?: number
    Recoil?: number
    Loudness?: number
    EffectiveDistance?: number
    Ergonomics?: number
    Velocity?: number
    RaidModdable?: boolean
    ToolModdable?: boolean
    BlocksFolding?: boolean
    BlocksCollapsible?: boolean
    IsAnimated?: boolean
    HasShoulderContact?: boolean
    SightingRange?: number
    DoubleActionAccuracyPenaltyMult?: number
    ModesCount?: number[] | number
    DurabilityBurnModificator?: number
    HeatFactor?: number
    CoolFactor?: number
    muzzleModType?: MuzzleModType
    CustomAimPlane?: CustomAimPlane
    sightModType?: SightModType
    aimingSensitivity?: number
    SightModesCount?: number
    OpticCalibrationDistances?: number[] | null
    ScopesCount?: number
    AimSensitivity?: Array<number[]> | number
    Zooms?: Array<number[]>
    CalibrationDistances?: Array<number[]>
    Intensity?: number
    Mask?: string
    MaskSize?: number
    NoiseIntensity?: number
    NoiseScale?: number
    Color?: Color
    DiffuseIntensity?: number
    HasHinge?: boolean
    RampPalette?: string
    DepthFade?: number
    RoughnessCoef?: number
    SpecularCoef?: number
    MainTexColorCoef?: number
    MinimumTemperatureValue?: number
    RampShift?: number
    HeatMin?: number
    ColdMax?: number
    IsNoisy?: boolean
    IsFpsStuck?: boolean
    IsGlitch?: boolean
    IsMotionBlurred?: boolean
    IsPixelated?: boolean
    PixelationBlockCount?: number
    ShiftsAimCamera?: number
    magAnimationIndex?: number
    Cartridges?: Cartridge[]
    CanFast?: boolean
    CanHit?: boolean
    CanAdmin?: boolean
    LoadUnloadModifier?: number
    CheckTimeModifier?: number
    CheckOverride?: number
    ReloadMagType?: ReloadM
    VisibleAmmoRangesString?: VisibleAmmoRangesString
    MalfunctionChance?: number
    IsShoulderContact?: boolean
    Foldable?: boolean
    Retractable?: boolean
    SizeReduceRight?: number
    CenterOfImpact?: number
    ShotgunDispersion?: number
    IsSilencer?: boolean
    DeviationCurve?: number
    DeviationMax?: number
    SearchSound?: SearchSound
    BlocksArmorVest?: boolean
    speedPenaltyPercent?: number
    GridLayoutName?: GridLayoutName
    SpawnFilter?: any[]
    containType?: any[]
    sizeWidth?: number
    sizeHeight?: number
    isSecured?: boolean
    spawnTypes?: string
    lootFilter?: any[]
    spawnRarity?: string
    minCountSpawn?: number
    maxCountSpawn?: number
    openedByKeyID?: any[]
    RigLayoutName?: string
    MaxDurability?: number
    armorZone?: ArmorZone[]
    armorClass?: number | string
    mousePenalty?: number
    weaponErgonomicPenalty?: number
    BluntThroughput?: number
    ArmorMaterial?: ArmorMaterial
    weapClass?: WeapClass
    weapUseType?: WeapUseType
    ammoCaliber?: string
    OperatingResource?: number
    RepairComplexity?: number
    durabSpawnMin?: number
    durabSpawnMax?: number
    isFastReload?: boolean
    RecoilForceUp?: number
    RecoilForceBack?: number
    Convergence?: number
    RecoilAngle?: number
    weapFireType?: WeapFireType[]
    RecolDispersion?: number
    SingleFireRate?: number
    CanQueueSecondShot?: boolean
    bFirerate?: number
    bEffDist?: number
    bHearDist?: number
    isChamberLoad?: boolean
    chamberAmmoCount?: number
    isBoltCatch?: boolean
    defMagType?: string
    defAmmo?: string
    AdjustCollimatorsToTrajectory?: boolean
    shotgunDispersion?: number
    Chambers?: Chamber[]
    CameraRecoil?: number
    CameraSnap?: number
    ReloadMode?: ReloadM
    AimPlane?: number
    TacticalReloadStiffnes?: AppliedHeadRotation
    TacticalReloadFixation?: number
    RecoilCenter?: AppliedHeadRotation
    RotationCenter?: AppliedHeadRotation
    RotationCenterNoStock?: AppliedHeadRotation
    FoldedSlot?: FoldedSlot
    CompactHandling?: boolean
    MinRepairDegradation?: number
    MaxRepairDegradation?: number
    IronSightRange?: number
    MustBoltBeOpennedForExternalReload?: boolean
    MustBoltBeOpennedForInternalReload?: boolean
    BoltAction?: boolean
    HipAccuracyRestorationDelay?: number
    HipAccuracyRestorationSpeed?: number
    HipInnaccuracyGain?: number
    ManualBoltCatch?: boolean
    BurstShotsCount?: number
    BaseMalfunctionChance?: number
    AllowJam?: boolean
    AllowFeed?: boolean
    AllowMisfire?: boolean
    AllowSlide?: boolean
    DurabilityBurnRatio?: number
    HeatFactorGun?: number
    CoolFactorGun?: number
    CoolFactorGunMods?: number
    HeatFactorByShot?: number
    AllowOverheat?: boolean
    DoubleActionAccuracyPenalty?: number
    RecoilPosZMult?: number
    BlocksEarpiece?: boolean
    BlocksEyewear?: boolean
    BlocksHeadwear?: boolean
    BlocksFaceCover?: boolean
    Indestructibility?: number
    headSegments?: HeadSegment[]
    FaceShieldComponent?: boolean
    FaceShieldMask?: FaceShieldMask
    MaterialType?: MaterialType
    RicochetParams?: AppliedHeadRotation
    DeafStrength?: DeafStrength
    BlindnessProtection?: number
    Distortion?: number
    CompressorTreshold?: number
    CompressorAttack?: number
    CompressorRelease?: number
    CompressorGain?: number
    CutoffFreq?: number
    Resonance?: number
    CompressorVolume?: number
    AmbientVolume?: number
    DryVolume?: number
    foodUseTime?: number
    foodEffectType?: DEffectType
    StimulatorBuffs?: string
    effects_health?: any[] | EffectsHealthClass
    effects_damage?: any[] | EffectsDamageClass
    MaximumNumberOfUsage?: number
    knifeHitDelay?: number
    knifeHitSlashRate?: number
    knifeHitStabRate?: number
    knifeHitRadius?: number
    knifeHitSlashDam?: number
    knifeHitStabDam?: number
    knifeDurab?: number
    PrimaryDistance?: number
    SecondryDistance?: number
    SlashPenetration?: number
    StabPenetration?: number
    PrimaryConsumption?: number
    SecondryConsumption?: number
    DeflectionConsumption?: number
    AppliedTrunkRotation?: AppliedHeadRotation
    AppliedHeadRotation?: AppliedHeadRotation
    DisplayOnModel?: boolean
    AdditionalAnimationLayer?: number
    StaminaBurnRate?: number
    ColliderScaleMultiplier?: AppliedHeadRotation
    ConfigPathStr?: string
    MaxMarkersCount?: number
    scaleMin?: number
    scaleMax?: number
    medUseTime?: number
    medEffectType?: DEffectType
    MaxHpResource?: number
    hpResourceRate?: number
    apResource?: number
    krResource?: number
    MaxOpticZoom?: number
    StackMinRandom?: number
    StackMaxRandom?: number
    ammoType?: AmmoType
    InitialSpeed?: number
    BallisticCoeficient?: number
    BulletMassGram?: number
    BulletDiameterMilimeters?: number
    Damage?: number
    ammoAccr?: number
    ammoRec?: number
    ammoDist?: number
    buckshotBullets?: number
    PenetrationPower?: number
    PenetrationPowerDiviation?: number
    ammoHear?: number
    ammoSfx?: AmmoSfx
    MisfireChance?: number
    MinFragmentsCount?: number
    MaxFragmentsCount?: number
    ammoShiftChance?: number
    casingName?: string
    casingEjectPower?: number
    casingMass?: number
    casingSounds?: CasingSounds
    ProjectileCount?: number
    PenetrationChance?: number
    RicochetChance?: number
    FragmentationChance?: number
    Deterioration?: number
    SpeedRetardation?: number
    Tracer?: boolean
    TracerColor?: TracerColor
    TracerDistance?: number
    ArmorDamage?: number
    Caliber?: string
    StaminaBurnPerDamage?: number
    HeavyBleedingDelta?: number
    LightBleedingDelta?: number
    ShowBullet?: boolean
    HasGrenaderComponent?: boolean
    FuzeArmTimeSec?: number
    ExplosionStrength?: number
    MinExplosionDistance?: number
    MaxExplosionDistance?: number
    FragmentsCount?: number
    FragmentType?: FragmentType
    ShowHitEffectOnExplode?: boolean
    ExplosionType?: ExplosionType
    AmmoLifeTimeSec?: number
    Contusion?: AppliedHeadRotation
    ArmorDistanceDistanceDamage?: AppliedHeadRotation
    Blindness?: AppliedHeadRotation
    IsLightAndSoundShot?: boolean
    LightAndSoundShotAngle?: number
    LightAndSoundShotSelfContusionTime?: number
    LightAndSoundShotSelfContusionStrength?: number
    MalfMisfireChance?: number
    MalfFeedChance?: number
    StackSlots?: Cartridge[]
    type?: string
    eqMin?: number
    eqMax?: number
    rate?: number
    ThrowType?: ThrowType
    ExplDelay?: number
    Strength?: number
    ContusionDistance?: number
    throwDamMax?: number
    explDelay?: number
    EmitTime?: number
    CanBeHiddenDuringThrow?: boolean
    MinTimeToContactExplode?: number
    ExplosionEffectType?: string
}

interface AppliedHeadRotation {
    x: number
    y: number
    z: number
}

enum ArmorMaterial {
    Aluminium = 'Aluminium',
    Aramid = 'Aramid',
    ArmoredSteel = 'ArmoredSteel',
    Ceramic = 'Ceramic',
    Combined = 'Combined',
    Glass = 'Glass',
    Titan = 'Titan',
    Uhmwpe = 'UHMWPE'
}

enum BackgroundColor {
    Black = 'black',
    Blue = 'blue',
    Default = 'default',
    Green = 'green',
    Grey = 'grey',
    Orange = 'orange',
    Red = 'red',
    Violet = 'violet',
    Yellow = 'yellow'
}

interface Cartridge {
    _name: CartridgeName
    _id: string
    _parent: string
    _max_count: number
    _props: CartridgeProps
    _proto: CartridgeProto
}

enum CartridgeName {
    Cartridges = 'cartridges'
}

interface CartridgeProps {
    filters: PurpleFilter[]
}

interface PurpleFilter {
    Filter: string[]
}

enum CartridgeProto {
    The5748538B2459770Af276A261 = '5748538b2459770af276a261'
}

interface Chamber {
    _name: ChamberName
    _id: string
    _parent: string
    _props: ChamberProps
    _required: boolean
    _mergeSlotWithChildren: boolean
    _proto: ChamberProto
}

enum ChamberName {
    PatronInWeapon = 'patron_in_weapon',
    PatronInWeapon000 = 'patron_in_weapon_000',
    PatronInWeapon001 = 'patron_in_weapon_001'
}

interface ChamberProps {
    filters: FluffyFilter[]
}

interface FluffyFilter {
    Filter: string[]
    MaxStackCount?: number
}

enum ChamberProto {
    The55D30C394Bdc2Dae468B4577 = '55d30c394bdc2dae468b4577',
    The55D30C4C4Bdc2Db4468B457E = '55d30c4c4bdc2db4468b457e',
    The55D4Af244Bdc2D962F8B4571 = '55d4af244bdc2d962f8b4571',
    The55D721144Bdc2D89028B456F = '55d721144bdc2d89028b456f'
}

interface Color {
    r: number
    g: number
    b: number
    a: number
}

enum CustomAimPlane {
    AkThermal = 'ak_thermal',
    Default = 'default',
    Empty = ''
}

enum DeafStrength {
    High = 'High',
    Low = 'Low',
    None = 'None'
}

enum ExplosionType {
    BigRoundImpact = 'big_round_impact',
    BigRoundImpactExplosive = 'big_round_impact_explosive',
    Empty = '',
    SmallgrenadeExpl = 'smallgrenade_expl'
}

enum FaceShieldMask {
    Narrow = 'Narrow',
    NoMask = 'NoMask',
    Wide = 'Wide'
}

enum FoldedSlot {
    Empty = '',
    ModStock = 'mod_stock',
    ModStock001 = 'mod_stock_001',
    ModStockAkms = 'mod_stock_akms',
    ModStockAxis = 'mod_stock_axis'
}

enum FragmentType {
    The5485A8684Bdc2Da71D8B4567 = '5485a8684bdc2da71d8b4567',
    The5996F6Cb86F774678763A6CA = '5996f6cb86f774678763a6ca',
    The5996F6D686F77467977Ba6Cc = '5996f6d686f77467977ba6cc',
    The5996F6Fc86F7745E585B4De3 = '5996f6fc86f7745e585b4de3'
}

enum GridLayoutName {
    Empty = '',
    F4Term = 'f4_term',
    Gunslinger1 = 'gunslinger1',
    Oakley = 'oakley',
    Paratus = 'Paratus'
}

interface Grid {
    _name: string
    _id: string
    _parent: string
    _props: GridProps
    _proto: GridProto
}

interface GridProps {
    filters: TentacledFilter[]
    cellsH: number
    cellsV: number
    minCount: number
    maxCount: number
    maxWeight: number
    isSortingTable: boolean
}

interface TentacledFilter {
    Filter: string[]
    ExcludedFilter: string[]
}

enum GridProto {
    The55D329C24Bdc2D892F8B4567 = '55d329c24bdc2d892f8b4567'
}

enum ItemSound {
    AmmoLauncher = 'ammo_launcher',
    AmmoPackGeneric = 'ammo_pack_generic',
    AmmoShotgun = 'ammo_shotgun',
    AmmoSingleround = 'ammo_singleround',
    ContainerCase = 'container_case',
    ContainerMetal = 'container_metal',
    ContainerPlastic = 'container_plastic',
    ContainerPouch = 'container_pouch',
    FoodBottle = 'food_bottle',
    FoodJuiceCarton = 'food_juice_carton',
    FoodSnack = 'food_snack',
    FoodSodaCan = 'food_soda_can',
    FoodTinCan = 'food_tin_can',
    GearArmor = 'gear_armor',
    GearBackpack = 'gear_backpack',
    GearGeneric = 'gear_generic',
    GearGoggles = 'gear_goggles',
    GearHelmet = 'gear_helmet',
    Generic = 'generic',
    Grenade = 'grenade',
    ItemBook = 'item_book',
    ItemClothGeneric = 'item_cloth_generic',
    ItemMap = 'item_map',
    ItemMoney = 'item_money',
    ItemPaper = 'item_paper',
    ItemPlasticGeneric = 'item_plastic_generic',
    Jewelry = 'jewelry',
    Keys = 'keys',
    KnifeGeneric = 'knife_generic',
    MagPlastic = 'mag_plastic',
    MagazineBelt = 'magazine_belt',
    MagazineDrum = 'magazine_drum',
    MagazineMetal = 'magazine_metal',
    MedBandage = 'med_bandage',
    MedMedkit = 'med_medkit',
    MedPills = 'med_pills',
    MedStimulator = 'med_stimulator',
    Mod = 'mod',
    Smallmetal = 'smallmetal',
    SpecArmorrep = 'spec_armorrep',
    SpecMultitool = 'spec_multitool',
    WeapAr = 'weap_ar',
    WeapDMR = 'weap_dmr',
    WeapPistol = 'weap_pistol',
    WeapPump = 'weap_pump',
    WeapRifle = 'weap_rifle'
}

enum MaterialType {
    BodyArmor = 'BodyArmor',
    GlassVisor = 'GlassVisor',
    Helmet = 'Helmet'
}

interface Prefab {
    path: string
    rcid: string
}

enum ReloadM {
    ExternalMagazine = 'ExternalMagazine',
    InternalMagazine = 'InternalMagazine',
    OnlyBarrel = 'OnlyBarrel'
}

enum SearchSound {
    CashregisterLooting = 'cashregister_looting',
    DrawerMetalLooting = 'drawer_metal_looting',
    DrawerWoodLooting = 'drawer_wood_looting',
    IndustrialboxLooting = 'industrialbox_looting',
    JacketLooting = 'jacket_looting',
    LootingBodyExtended = 'looting_body_extended',
    SafeLooting = 'safe_looting',
    SportbagLooting = 'sportbag_looting',
    TechnoBoxLooting01 = 'techno_box_looting_01',
    WoodboxLooting = 'woodbox_looting'
}

interface Slot {
    _name: string
    _id: string
    _parent: string
    _props: SlotProps
    _required: boolean
    _mergeSlotWithChildren: boolean
    _proto: ChamberProto
}

interface SlotProps {
    filters: StickyFilter[]
}

interface StickyFilter {
    Filter: string[]
    Shift?: number
    MaxStackCount?: number
    AnimationIndex?: number
}

enum ThrowType {
    FlashGrenade = 'flash_grenade',
    FragGrenade = 'frag_grenade',
    SmokeGrenade = 'smoke_grenade'
}

enum TracerColor {
    Green = 'green',
    Red = 'red',
    TracerGreen = 'tracerGreen',
    TracerRed = 'tracerRed',
    TracerYellow = 'tracerYellow'
}

enum UnlootableFromSide {
    Bear = 'Bear',
    Savage = 'Savage',
    Usec = 'Usec'
}

enum UnlootableFromSlot {
    ArmBand = 'ArmBand',
    Compass = 'Compass',
    FirstPrimaryWeapon = 'FirstPrimaryWeapon',
    Scabbard = 'Scabbard'
}

enum VisibleAmmoRangesString {
    Empty = '',
    The111830 = '1-1;18-30',
    The112 = '1-12',
    The11446688101012121414161618182020 = '1-1;4-4;6-6;8-8;10-10;12-12;14-14;16-16;18-18;20-20',
    The114581013151820 = '1-1;4-5;8-10;13-15;18-20',
    The1148 = '1-1;4-8',
    The12 = '1-2',
    The121927 = '1-2;19-27',
    The125 = '1-25',
    The13 = '1-3',
    The141220 = '1-4;12-20'
}

enum AmmoSfx {
    Standart = 'standart',
    Tracer = 'tracer',
    TracerRed = 'tracer_red'
}

enum AmmoType {
    Buckshot = 'buckshot',
    Bullet = 'bullet',
    Grenade = 'grenade'
}

enum ArmorZone {
    Chest = 'Chest',
    Head = 'Head',
    LeftArm = 'LeftArm',
    RightArm = 'RightArm',
    Stomach = 'Stomach'
}

enum CasingSounds {
    PistolSmall = 'pistol_small',
    Rifle556 = 'rifle556',
    Rifle762 = 'rifle762',
    ShotgunBig = 'shotgun_big',
    ShotgunSmall = 'shotgun_small',
    The127Rifle = '127rifle',
    The40Mmgrenade = '40mmgrenade',
    The50Cal = '50cal'
}

interface EffectsDamageClass {
    RadExposure?: DestroyedPart
    Pain?: Contusion
    Contusion?: Contusion
    Intoxication?: Contusion
    LightBleeding?: DestroyedPart
    HeavyBleeding?: DestroyedPart
    DestroyedPart?: DestroyedPart
    Fracture?: DestroyedPart
}

interface Contusion {
    delay: number
    duration: number
    fadeOut?: number
    cost?: number
}

interface DestroyedPart {
    delay: number
    duration: number
    fadeOut?: number
    cost?: number
    healthPenaltyMin?: number
    healthPenaltyMax?: number
}

interface EffectsHealthClass {
    Energy?: Energy
    Hydration?: Energy
}

interface Energy {
    value: number
}

enum DEffectType {
    AfterUse = 'afterUse',
    DuringUse = 'duringUse'
}

enum HeadSegment {
    Ears = 'Ears',
    Eyes = 'Eyes',
    Jaws = 'Jaws',
    LowerNape = 'LowerNape',
    Nape = 'Nape',
    Top = 'Top'
}

enum MuzzleModType {
    Brake = 'brake',
    Conpensator = 'conpensator',
    MuzzleCombo = 'muzzleCombo',
    Pms = 'pms',
    Silencer = 'silencer'
}

enum SightModType {
    Hybrid = 'hybrid',
    Iron = 'iron',
    Optic = 'optic',
    Reflex = 'reflex'
}

enum WeapClass {
    AssaultCarbine = 'assaultCarbine',
    AssaultRifle = 'assaultRifle',
    GrenadeLauncher = 'grenadeLauncher',
    Machinegun = 'machinegun',
    MarksmanRifle = 'marksmanRifle',
    Pistol = 'pistol',
    Shotgun = 'shotgun',
    Smg = 'smg',
    SniperRifle = 'sniperRifle',
    SpecialWeapon = 'specialWeapon'
}

enum WeapFireType {
    Burst = 'burst',
    Doubleaction = 'doubleaction',
    Doublet = 'doublet',
    Fullauto = 'fullauto',
    Single = 'single'
}

enum WeapUseType {
    Primary = 'primary',
    Secondary = 'secondary'
}

enum Type {
    Item = 'Item',
    Node = 'Node'
}

interface Locales {
    interface: { [key: string]: string }
    enum: any[]
    error: { [key: string]: string }
    mail: { [key: string]: number | string }
    quest: {
        [key: string]: {
            name: string
            description: string
            note: string
            failMessageText: string
            startedMessageText: string
            successMessageText: string
            location: string
            conditions: { [key: string]: string }
        }
    }
    preset: { [key: string]: Preset }
    handbook: { [key: string]: string }
    season: { [key: string]: string }
    customization: { [key: string]: The5_C1B857086F77465F465Faa4 }
    repeatableQuest: { [key: string]: string }
    templates: { [key: string]: Template }
    locations: { [key: string]: The55_F2D3Fd4Bdc2D5F408B4567 }
    banners: Banners
    trading: { [key: string]: Trading }
}

interface Banners {
    '5464e0404bdc2d2a708b4567': The5464_E0404Bdc2D2A708B4567
    '5464e0454bdc2d06708b4567': The5464_E0404Bdc2D2A708B4567
    '5807be8924597742c603fa19': The5464_E0404Bdc2D2A708B4567
    '5805f617245977100b2c1f41': The5464_E0404Bdc2D2A708B4567
    '5807bfe124597742a92e0a4c': The5464_E0404Bdc2D2A708B4567
    '5803a58524597710ca36fcb2': The5464_E0404Bdc2D2A708B4567
    '5807c3f124597746bf2db2ce': The5464_E0404Bdc2D2A708B4567
    '5c1b857086f77465f465faa4': The5_C1B857086F77465F465Faa4
}

interface The5464_E0404Bdc2D2A708B4567 {
    name: string
    description: string
}

interface The5_C1B857086F77465F465Faa4 {
    Name: string
    ShortName: string
    Description: string
}

interface Locations {
    '5704e47ed2720bb35b8b4568': The55_F2D3Fd4Bdc2D5F408B4567
    '5704e5a4d2720bb45b8b4567': The55_F2D3Fd4Bdc2D5F408B4567
    '5704e4dad2720bb55b8b4567': The55_F2D3Fd4Bdc2D5F408B4567
    '55f2d3fd4bdc2d5f408b4567': The55_F2D3Fd4Bdc2D5F408B4567
    '5704e5fad2720bc05b8b4567': The55_F2D3Fd4Bdc2D5F408B4567
    '5714dbc024597771384a510d': The55_F2D3Fd4Bdc2D5F408B4567
    '56db0b3bd2720bb0678b4567': The55_F2D3Fd4Bdc2D5F408B4567
    '56f40101d2720b2a4d8b45d6': The55_F2D3Fd4Bdc2D5F408B4567
    '5704e64ad2720bb55b8b456e': The55_F2D3Fd4Bdc2D5F408B4567
    '5704e554d2720bac5b8b456e': The55_F2D3Fd4Bdc2D5F408B4567
    '599319c986f7740dca3070a6': The55_F2D3Fd4Bdc2D5F408B4567
    '5714dc342459777137212e0b': The55_F2D3Fd4Bdc2D5F408B4567
    '5704e3c2d2720bac5b8b4567': The55_F2D3Fd4Bdc2D5F408B4567
    '59fc81d786f774390775787e': The55_F2D3Fd4Bdc2D5F408B4567
    '5714dc692459777137212e12': The55_F2D3Fd4Bdc2D5F408B4567
    '5b0fc42d86f7744a585f9105': The5_C1B857086F77465F465Faa4
}

interface The55_F2D3Fd4Bdc2D5F408B4567 {
    Name: string
    Description: string
}

interface Preset {
    Name: null | string
}

interface TartuGecko {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: { [key: string]: string }
    location: string
}

interface The59674Cd986F7744Ab26E32F2 {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59674Cd986F7744Ab26E32F2Conditions
    location: string
}

interface The59674Cd986F7744Ab26E32F2Conditions {
    '5cb31b6188a450159d330a18': string
}

interface The596760E186F7741E11214D58 {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The596760E186F7741E11214D58Conditions
    location: string
}

interface The596760E186F7741E11214D58Conditions {
    '5968975586f7740e7266d974': string
}

interface The5968Eb3186F7741Dde183A4D {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The5968Eb3186F7741Dde183A4DConditions
    location: string
}

interface The5968Eb3186F7741Dde183A4DConditions {
    '5968eb9b86f7741ddb481543': string
}

interface The596B455186F77457Cb50Eccb {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The596B455186F77457Cb50EccbConditions
    location: string
}

interface The596B455186F77457Cb50EccbConditions {
    '5c9b5e3f86f7744aab7329b5': string
}

interface The59C50A9E86F7745Fef66F4Ff {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59C50A9E86F7745Fef66F4FfConditions
    location: string
}

interface The59C50A9E86F7745Fef66F4FfConditions {
    '59674d5186f00443b872d5f7': string
}

interface The59C512Ad86F7741F0D09De9B {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59C512Ad86F7741F0D09De9BConditions
    location: string
}

interface The59C512Ad86F7741F0D09De9BConditions {
    '59674d5186f77446b852d5f7': string
}

interface The59C93E8E86F7742A406989C4 {
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    conditions: The59C93E8E86F7742A406989C4Conditions
    location: string
}

interface The59C93E8E86F7742A406989C4Conditions {
    '596a10d886f7741ddf11dbf0': string
}

interface The59F9Da6786F774714230D751 {
    conditions: The59F9Da6786F774714230D751Conditions
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    description: string
    location: string
    name: string
}

interface The59F9Da6786F774714230D751Conditions {}

interface The5A03153686F77442D90E2171 {
    conditions: The5A03153686F77442D90E2171Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A03153686F77442D90E2171Conditions {
    '5c9a17c686f7747dbe2da3c1': string
}

interface The5A27Ba9586F7741B543D8E85 {
    conditions: The5A27Ba9586F7741B543D8E85Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27Ba9586F7741B543D8E85Conditions {
    '5a28127b86f7743808504ecc': string
}

interface The5A27Bb8386F7741C770D2D0A {
    conditions: The5A27Bb8386F7741C770D2D0AConditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27Bb8386F7741C770D2D0AConditions {
    '5c9de99286f7741ced54c902': string
}

interface The5A27Bc8586F7741B543D8Ea4 {
    conditions: The5A27Bc8586F7741B543D8Ea4Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27Bc8586F7741B543D8Ea4Conditions {
    '5a28235e86f7741da250b438': string
}

interface The5A27D2Af86F7744E1115B323 {
    conditions: The5A27D2Af86F7744E1115B323Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A27D2Af86F7744E1115B323Conditions {
    '5a27d34586f7744e1115b327': string
}

interface The5A68667486F7742607157D28 {
    conditions: The5A68667486F7742607157D28Conditions
    name: string
    description: string
    note: string
    failMessageText: string
    startedMessageText: string
    successMessageText: string
    location: string
}

interface The5A68667486F7742607157D28Conditions {
    '5a6878e886f7745e65687985': string
}

interface The5_E73519B0B997B5E887E59B3 {
    conditions: { [key: string]: string }
    location: string
    name: string
}

interface The5E748327Dbe23170E05094F4 {
    conditions: The5E748327Dbe23170E05094F4Conditions
    location: string
    name: string
}

interface The5E748327Dbe23170E05094F4Conditions {
    '5e74833f0b1f9954c86ee49c': string
}

interface The5E748D226725D419A47E2101 {
    conditions: The5E748D226725D419A47E2101Conditions
    location: string
    name: string
}

interface The5E748D226725D419A47E2101Conditions {
    '5e748d406725d419a47e2104': string
}

interface The5E748D9Fc73F9622610Abb37 {
    conditions: The5E748D9Fc73F9622610Abb37Conditions
    location: string
    name: string
}

interface The5E748D9Fc73F9622610Abb37Conditions {
    '5e748dc9391f136a9201292e': string
}

interface The5E748Df9C73F9622610Abb38 {
    conditions: The5E748Df9C73F9622610Abb38Conditions
    location: string
    name: string
}

interface The5E748Df9C73F9622610Abb38Conditions {
    '5e748e12c73f9622610abb3b': string
}

interface The5E748E8Fa848081E986A58A2 {
    conditions: The5E748E8Fa848081E986A58A2Conditions
    location: string
    name: string
}

interface The5E748E8Fa848081E986A58A2Conditions {
    '5e7b805f0bc7e118403c847d': string
}

interface The5E74921Dc73F9622610Abb3E {
    conditions: The5E74921Dc73F9622610Abb3EConditions
    location: string
    name: string
}

interface The5E74921Dc73F9622610Abb3EConditions {
    '5e74922b35e14d4fb162de6d': string
}

interface The5E7492C2Cdcce040Bf508424 {
    conditions: The5E7492C2Cdcce040Bf508424Conditions
    location: string
    name: string
}

interface The5E7492C2Cdcce040Bf508424Conditions {
    '5e749308a848081e986a58a6': string
}

interface The5E7493D5C377F60Fe17D6Ec8 {
    conditions: The5E7493D5C377F60Fe17D6Ec8Conditions
    location: string
    name: string
}

interface The5E7493D5C377F60Fe17D6Ec8Conditions {
    '5e7493e9c377f60fe17d6ecb': string
}

interface The5E749741Dec1852497081E69 {
    conditions: The5E749741Dec1852497081E69Conditions
    location: string
    name: string
}

interface The5E749741Dec1852497081E69Conditions {
    '5e74a5f2647a0846684a1dc4': string
}

interface The5E7498198F3A2F53Cc477E99 {
    conditions: The5E7498198F3A2F53Cc477E99Conditions
    location: string
    name: string
}

interface The5E7498198F3A2F53Cc477E99Conditions {
    '5e74983470d454700576d1fb': string
}

interface The5E7498Cc2Eb35C76F5087A47 {
    conditions: The5E7498Cc2Eb35C76F5087A47Conditions
    location: string
    name: string
}

interface The5E7498Cc2Eb35C76F5087A47Conditions {
    '5e7498d9c377f60fe17d6ed4': string
}

interface The5E74990C647A0846684A1Db4 {
    conditions: The5E74990C647A0846684A1Db4Conditions
    location: string
    name: string
}

interface The5E74990C647A0846684A1Db4Conditions {
    '5e749921dec1852497081e6d': string
}

interface The5E74A68870D454700576D1Fe {
    conditions: The5E74A68870D454700576D1FeConditions
    location: string
    name: string
}

interface The5E74A68870D454700576D1FeConditions {
    '5e74a6a4d9d3481b8e64369e': string
}

interface The5E74A765C377F60Fe17D6Edb {
    conditions: The5E74A765C377F60Fe17D6EdbConditions
    location: string
    name: string
}

interface The5E74A765C377F60Fe17D6EdbConditions {
    '5e74a798763a4645365a6186': string
}

interface The5E74A9Be70D454700576D1Ff {
    conditions: The5E74A9Be70D454700576D1FfConditions
    location: string
    name: string
}

interface The5E74A9Be70D454700576D1FfConditions {
    '5e7a0c8ee77ff7644b69febe': string
}

interface The5E74Aafac377F60Fe17D6Ede {
    conditions: The5E74Aafac377F60Fe17D6EdeConditions
    location: string
    name: string
}

interface The5E74Aafac377F60Fe17D6EdeConditions {
    '5e7b2993f60dc341415906fb': string
}

interface The5E74Ac3F70D454700576D200 {
    conditions: The5E74Ac3F70D454700576D200Conditions
    location: string
    name: string
}

interface The5E74Ac3F70D454700576D200Conditions {
    '5e74ac57763a4645365a618b': string
}

interface The5E74B1B201E03F5A8D48Aff9 {
    conditions: The5E74B1B201E03F5A8D48Aff9Conditions
    location: string
    name: string
}

interface The5E74B1B201E03F5A8D48Aff9Conditions {
    '5e74b1c4c16d705f775de1db': string
}

interface The5E74Be4C24C2C642Fa612776 {
    conditions: The5E74Be4C24C2C642Fa612776Conditions
    location: string
    name: string
}

interface The5E74Be4C24C2C642Fa612776Conditions {
    '5e7a012228b2fd48f6591c8f': string
}

interface The5E85E1D15549Dd01Fe748B5A {
    conditions: The5E85E1D15549Dd01Fe748B5AConditions
    location: string
    name: string
}

interface The5E85E1D15549Dd01Fe748B5AConditions {
    '5e85e22e5549dda42377fa77': string
}

interface The5E85E2Fa5549Dd01Fe748B5B {
    conditions: The5E85E2Fa5549Dd01Fe748B5BConditions
    location: string
    name: string
}

interface The5E85E2Fa5549Dd01Fe748B5BConditions {
    '5e85e32a5549ddfb4a0cdb3a': string
}

interface The5E85E40D5549Dd10225137B9 {
    conditions: The5E85E40D5549Dd10225137B9Conditions
    location: string
    name: string
}

interface The5E85E40D5549Dd10225137B9Conditions {
    '5e872a5a5549ddc49d49a643': string
}

interface The5E85E5025549Dda42377Fa7B {
    conditions: The5E85E5025549Dda42377Fa7BConditions
    location: string
    name: string
}

interface The5E85E5025549Dda42377Fa7BConditions {
    '5e85e5405549ddb56f1cf0d9': string
}

interface The5E85E77E5549Ddf8E2131C0B {
    conditions: The5E85E77E5549Ddf8E2131C0BConditions
    location: string
    name: string
}

interface The5E85E77E5549Ddf8E2131C0BConditions {
    '5e85e7b45549dd422605cc1d': string
}

interface The5Eaaaa7C93Afa0558F3B5A1C {
    conditions: The5Eaaaa7C93Afa0558F3B5A1CConditions
    name: string
    note: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    description: string
    location: string
}

interface The5Eaaaa7C93Afa0558F3B5A1CConditions {
    '5eaaaa7c93afa0558f3b5a1f': string
}

interface The5F70Abfae9F14826Bf7C1C65 {
    conditions: The5F70Abfae9F14826Bf7C1C65Conditions
    location: string
    name: string
}

interface The5F70Abfae9F14826Bf7C1C65Conditions {
    '5f970525cfe8173d12189403': string
}

interface The5F70B9Cfe9F14826Bf7C1C67 {
    conditions: The5F70B9Cfe9F14826Bf7C1C67Conditions
    location: string
    name: string
}

interface The5F70B9Cfe9F14826Bf7C1C67Conditions {
    '5f71d67f413b7a71bb3d4883': string
}

interface The5F70E2A5Dcfde927745Eb1D0 {
    conditions: The5F70E2A5Dcfde927745Eb1D0Conditions
    location: string
    name: string
}

interface The5F70E2A5Dcfde927745Eb1D0Conditions {
    '5f8d63247b5bb8669b67ed4a': string
}

interface The5F75C5078Fb5C37Ce1766E95 {
    conditions: The5F75C5078Fb5C37Ce1766E95Conditions
    location: string
    name: string
}

interface The5F75C5078Fb5C37Ce1766E95Conditions {
    '5f9701bc261b2c7e0322947b': string
}

interface The5F75C578Dfacb47E146A0062 {
    conditions: The5F75C578Dfacb47E146A0062Conditions
    location: string
    name: string
}

interface The5F75C578Dfacb47E146A0062Conditions {
    '5f75c578dfacb47e146a0063': string
}

interface The5F75Fd4450914C5Fcc425279 {
    conditions: The5F75Fd4450914C5Fcc425279Conditions
    location: string
    name: string
}

interface The5F75Fd4450914C5Fcc425279Conditions {
    '5f75fd4450914c5fcc42527a': string
}

interface The5F75Fddbd24E8B7A9C508F3A {
    conditions: The5F75Fddbd24E8B7A9C508F3AConditions
    location: string
    name: string
}

interface The5F75Fddbd24E8B7A9C508F3AConditions {
    '5f8f1423d613404c430b7895': string
}

interface The6179Acbdc760Af5Ad2053585 {
    conditions: The6179Acbdc760Af5Ad2053585Conditions
    name: string
    note: string
    description: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    location: string
}

interface The6179Acbdc760Af5Ad2053585Conditions {
    '617bd94c5a52d2390a2630c7': string
}

interface The6179Ad0A6E9Dd54Ac275E3F2 {
    name: string
    note: string
    description: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    conditions: The6179Ad0A6E9Dd54Ac275E3F2Conditions
    location: string
}

interface The6179Ad0A6E9Dd54Ac275E3F2Conditions {
    '617bf1e1d93d977d2452051f': string
}

interface The6179Aff8F57Fb279792C60A1 {
    name: string
    note: string
    description: string
    successMessageText: string
    failMessageText: string
    startedMessageText: string
    conditions: The6179Aff8F57Fb279792C60A1Conditions
    location: string
}

interface The6179Aff8F57Fb279792C60A1Conditions {
    '617bf4e152e86c73d372a95d': string
}

interface The6193850F60B34236Ee0483De {
    conditions: The6193850F60B34236Ee0483DeConditions
    name: string
    note: string
    successMessageText: string
    description: string
    failMessageText: string
    startedMessageText: string
    location: string
}

interface The6193850F60B34236Ee0483DeConditions {
    '6193dabd5f6468204470571f': string
}

interface The61Bb47481908C67D4249A205 {
    name: string
    note: string
    startedMessageText: string
    failMessageText: string
    description: string
    successMessageText: string
    conditions: The61Bb47481908C67D4249A205Conditions
    location: string
}

interface The61Bb47481908C67D4249A205Conditions {
    '61bc887f4dbcdb6107410c97': string
}

interface The61Bb474Dce7374453B45Dfd2 {
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    conditions: The61Bb474Dce7374453B45Dfd2Conditions
    location: string
}

interface The61Bb474Dce7374453B45Dfd2Conditions {
    '61bb69e23177025bdd356695': string
}

interface The61Bb474F8B8D2A79D012Cd6E {
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    conditions: The61Bb474F8B8D2A79D012Cd6EConditions
    location: string
}

interface The61Bb474F8B8D2A79D012Cd6EConditions {
    '61bb6c0c6b70332c062ca7bb': string
}

interface The61Bb47516B70332C062Ca7B9 {
    name: string
    note: string
    description: string
    successMessageText: string
    startedMessageText: string
    failMessageText: string
    conditions: The61Bb47516B70332C062Ca7B9Conditions
    location: string
}

interface The61Bb47516B70332C062Ca7B9Conditions {
    '61bb6d65d511a47f501702f0': string
}

interface Template {
    Name: string
    ShortName: number | string
    Description: string
    casingName?: string
    RigLayoutName?: string
    FoldedSlot?: string
}

interface Trading {
    FullName: string
    FirstName: string
    Nickname: string
    Location: string
    Description: string
}

interface RawQuest {
    id: number
    require: Require
    giver: number
    turnin: number
    title: string
    locales?: Locales
    wiki: string
    exp: number
    unlocks: string[]
    reputation: Reputation[]
    objectives: Objective[]
    gameId: string
    reputationFailure?: Reputation[]
    alternatives?: number[]
    nokappa?: boolean
}

interface Locales {
    en: string
    ru?: string
    cs?: string
}

interface Objective {
    type: ObjectiveType
    target: string[] | number | string
    number: number
    location?: number
    id: number
    gps?: Gps
    tool?: Tool
    hint?: string
    have?: number
    with?: Array<WithClass | string>
}

interface Gps {
    leftPercent: number | null
    topPercent: number | null
    floor: Floor
}

enum Floor {
    Basement = 'Basement',
    Bunkers = 'Bunkers',
    FirstFloor = 'First_Floor',
    GroundFloor = 'Ground_Floor',
    GroundLevel = 'Ground_Level',
    SecondFloor = 'Second_Floor'
}

enum Tool {
    The5991B51486F77447B112D44F = '5991b51486f77447b112d44f',
    The5Ac78A9B86F7741Cca0Bbd8D = '5ac78a9b86f7741cca0bbd8d',
    The5B4391A586F7745321235Ab2 = '5b4391a586f7745321235ab2'
}

enum ObjectiveType {
    Build = 'build',
    Collect = 'collect',
    Find = 'find',
    Key = 'key',
    Kill = 'kill',
    Locate = 'locate',
    Mark = 'mark',
    Pickup = 'pickup',
    Place = 'place',
    Reputation = 'reputation',
    Skill = 'skill',
    Warning = 'warning'
}

interface WithClass {
    type: WithType
    name?: Name
    value?: number | string
    id?: IDElement[] | string
}

interface IDElement {
    id: string
}

enum Name {
    Durability = 'durability',
    Ergonomics = 'ergonomics',
    ExtendedMagazine = 'Extended magazine',
    Foregrip = 'Foregrip',
    Recoil = 'recoil',
    SightingRange = 'sighting range',
    Suppressor = 'Suppressor',
    TacticalDevice = 'Tactical device',
    Weight = 'weight'
}

enum WithType {
    Attachment = 'attachment',
    Cells = 'cells',
    Part = 'part',
    Stat = 'stat'
}

interface Reputation {
    trader: number
    rep: number
}

interface Require {
    level?: number | null
    quests: Array<number[] | number>
    loyalty?: Loyalty[]
}

interface Loyalty {
    trader: number
    stage: number
}
