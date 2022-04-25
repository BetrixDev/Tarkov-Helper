export type ItemType =
    | 'Item'
    | 'Fuel'
    | 'Other'
    | 'BuildingMaterial'
    | 'Tool'
    | 'HouseholdGoods'
    | 'Lubricant'
    | 'Battery'
    | 'Electronics'
    | 'MedicalSupplies'
    | 'Jewelry'
    | 'Pms'
    | 'FlashHider'
    | 'Silencer'
    | 'MuzzleCombo'
    | 'Compensator'
    | 'ThermalVision'
    | 'NightVision'
    | 'AssaultScope'
    | 'OpticScope'
    | 'Collimator'
    | 'CompactCollimator'
    | 'IronSight'
    | 'SpecialScope'
    | 'Foregrip'
    | 'Bipod'
    | 'AuxiliaryMod'
    | 'Gasblock'
    | 'Sights'
    | 'Flashlight'
    | 'LightLaser'
    | 'TacticalCombo'
    | 'RailCovers'
    | 'Muzzle'
    | 'CylinderMagazine'
    | 'Shaft'
    | 'Charge'
    | 'Stock'
    | 'Launcher'
    | 'Magazine'
    | 'Mount'
    | 'Barrel'
    | 'MasterMod'
    | 'PistolGrip'
    | 'Receiver'
    | 'Handguard'
    | 'FunctionalMod'
    | 'GearMod'
    | 'Pockets'
    | 'Backpack'
    | 'MobContainer'
    | 'LootContainer'
    | 'Vest'
    | 'SortingTable'
    | 'SpecialWeapon'
    | 'SniperRifle'
    | 'AssaultCarbine'
    | 'Pistol'
    | 'Shotgun'
    | 'GrenadeLauncher'
    | 'Smg'
    | 'AssaultRifle'
    | 'MachineGun'
    | 'MarksmanRifle'
    | 'Revolver'
    | 'Armor'
    | 'Visors'
    | 'FaceCover'
    | 'Headwear'
    | 'Headphones'
    | 'ArmoredEquipment'
    | 'Stash'
    | 'SearchableItem'
    | 'ArmBand'
    | 'Weapon'
    | 'LockableContainer'
    | 'SimpleContainer'
    | 'Inventory'
    | 'Equipment'
    | 'StationaryContainer'
    | 'Mod'
    | 'Drink'
    | 'Food'
    | 'Keycard'
    | 'KeyMechanical'
    | 'Stimulator'
    | 'MedKit'
    | 'Medical'
    | 'Compass'
    | 'Drugs'
    | 'PortableRangeFinder'
    | 'Money'
    | 'AmmoBox'
    | 'Ammo'
    | 'BarterItem'
    | 'CompoundItem'
    | 'SpecItem'
    | 'Knife'
    | 'ThrowWeap'
    | 'Map'
    | 'StackableItem'
    | 'Info'
    | 'Key'
    | 'FoodDrink'
    | 'Meds'

type TarkovToolsTypes =
    | 'ammo'
    | 'ammoBox'
    | 'armor'
    | 'backpack'
    | 'barter'
    | 'container'
    | 'disabled'
    | 'glasses'
    | 'grenade'
    | 'gun'
    | 'headphones'
    | 'helmet'
    | 'injectors'
    | 'keys'
    | 'markedOnly'
    | 'meds'
    | 'mods'
    | 'noFlea'
    | 'pistolGrip'
    | 'provisions'
    | 'rig'
    | 'suppressor'
    | 'wearable'

// Tarkov Tools
export interface TarkovToolsItem {
    id: string
    shortName: string
    name: string
    types: TarkovToolsTypes[]
    updated: string
    avg24hPrice: number
    lastLowPrice: number | null
    changeLast48hPercent: number | null
    width: number
    height: number
    wikiLink: string
    sellFor: ItemPrice[]
    buyFor: ItemPrice[]
}

export interface ItemPrice {
    source: TraderName
    price: number
    priceRUB: number
    requirements: Requirement[]
}

export interface Requirement {
    type: RequirementType
    value: number | null
}

export interface RawItem {
    _id: string
    _name: string
    _parent: string
    _type: Type
    _props: RawItemProps
    _proto?: string
}

export interface RawItemProps {
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
    NoiseIntensity?: number
    IsFpsStuck?: boolean
    IsGlitch?: boolean
    IsMotionBlurred?: boolean
    Mask?: string
    MaskSize?: number
    IsPixelated?: boolean
    PixelationBlockCount?: number
    Intensity?: number
    NoiseScale?: number
    Color?: Color
    DiffuseIntensity?: number
    HasHinge?: boolean
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

interface Cartridge {
    _name: CartridgeName
    _id: string
    _parent: string
    _max_count: number
    _props: CartridgeProps
    _proto: CartridgeProto
}

interface CartridgeProps {
    filters: PurpleFilter[]
}

interface PurpleFilter {
    Filter: string[]
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

interface ChamberProps {
    filters: FluffyFilter[]
}

interface FluffyFilter {
    Filter: string[]
    MaxStackCount?: number
}

interface Color {
    r: number
    g: number
    b: number
    a: number
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

interface Prefab {
    path: string
    rcid: string
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

interface EffectsDamageClass {
    RadExposure?: DestroyedPart
    Pain?: Contusion
    Intoxication?: Contusion
    Contusion?: Contusion
    LightBleeding?: DestroyedPart
    HeavyBleeding?: DestroyedPart
    Fracture?: DestroyedPart
    DestroyedPart?: DestroyedPart
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

enum CartridgeName {
    Cartridges = 'cartridges'
}

enum CartridgeProto {
    The5748538B2459770Af276A261 = '5748538b2459770af276a261'
}

enum ChamberName {
    PatronInWeapon = 'patron_in_weapon',
    PatronInWeapon000 = 'patron_in_weapon_000',
    PatronInWeapon001 = 'patron_in_weapon_001'
}

enum ChamberProto {
    The55D30C394Bdc2Dae468B4577 = '55d30c394bdc2dae468b4577',
    The55D30C4C4Bdc2Db4468B457E = '55d30c4c4bdc2db4468b457e',
    The55D4Af244Bdc2D962F8B4571 = '55d4af244bdc2d962f8b4571',
    The55D721144Bdc2D89028B456F = '55d721144bdc2d89028b456f'
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

const enum ArmorMaterial {
    Aluminium = 'Aluminium',
    Aramid = 'Aramid',
    ArmoredSteel = 'ArmoredSteel',
    Ceramic = 'Ceramic',
    Combined = 'Combined',
    Glass = 'Glass',
    Titan = 'Titan',
    Uhmwpe = 'UHMWPE'
}

const enum TraderName {
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

const enum ItemSourceName {
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

const enum RequirementType {
    PlayerLevel = 'playerLevel',
    LoyaltyLevel = 'loyaltyLevel',
    QuestCompleted = 'questCompleted'
}
