type ItemType =
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

// Tarkov Tools
interface TarkovToolsItem {
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

interface ItemPrice {
    source: TraderName
    price: number
    requirements: Requirement[]
}

interface Requirement {
    type: RequirementType
    value: number | null
}

// Item Props
interface RawItem {
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

// Quest Data
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
    interface: ObjectiveType
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

interface WithClass {
    interface: WithType
    name?: Name
    value?: number | string
    id?: stringElement[] | string
}

interface stringElement {
    id: string
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

// Barter Data
interface RawBarter {
    source: string
    requiredItems: ContainedItem[]
    rewardItems: ContainedItem[]
}

interface ContainedItem {
    item: TarkovToolsItem
    count: number
    quantity: number
}

// Hideout Data
interface HideoutModule {
    id: number
    name: string
    level: number
    itemRequirements: [ContainedItem]
    moduleRequirements: [HideoutModule]
}

// Locales
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
    locations: { [key: string]: MapLocale }
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
    '5704e47ed2720bb35b8b4568': MapLocale
    '5704e5a4d2720bb45b8b4567': MapLocale
    '5704e4dad2720bb55b8b4567': MapLocale
    '55f2d3fd4bdc2d5f408b4567': MapLocale
    '5704e5fad2720bc05b8b4567': MapLocale
    '5714dbc024597771384a510d': MapLocale
    '56db0b3bd2720bb0678b4567': MapLocale
    '56f40101d2720b2a4d8b45d6': MapLocale
    '5704e64ad2720bb55b8b456e': MapLocale
    '5704e554d2720bac5b8b456e': MapLocale
    '599319c986f7740dca3070a6': MapLocale
    '5714dc342459777137212e0b': MapLocale
    '5704e3c2d2720bac5b8b4567': MapLocale
    '59fc81d786f774390775787e': MapLocale
    '5714dc692459777137212e12': MapLocale
    '5b0fc42d86f7744a585f9105': The5_C1B857086F77465F465Faa4
}

interface MapLocale {
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

// Map Links Data
interface MapImageData {
    [key: string]: MapImage[]
}

interface MapImage {
    name: string
    link: string
    author: string
}

// Raw Map Data
interface RawMapData {
    AccessKeys: any[]
    AirdropParameters: AirdropParameter[]
    Area: number
    AveragePlayTime: number
    AveragePlayerLevel: number
    Banners: Banner[]
    BossLocationSpawn: BossLocationSpawn[]
    BotAssault: number
    BotEasy: number
    BotHard: number
    BotImpossible: number
    BotLocationModifier: BotLocationModifier
    BotMarksman: number
    BotMax: number
    BotMaxPlayer: number
    BotMaxTimePlayer: number
    BotNormal: number
    BotSpawnTimeOffMax: number
    BotSpawnTimeOffMin: number
    BotSpawnTimeOnMax: number
    BotSpawnTimeOnMin: number
    BotStart: number
    BotStop: number
    Description: string
    DisabledForScav: boolean
    DisabledScavExits: string
    Enabled: boolean
    GlobalLootChanceModifier: number
    IconX: number
    IconY: number
    Id: string
    Insurance: boolean
    IsSecret: boolean
    Locked: boolean
    Loot: any[]
    MaxBotPerZone: number
    MaxDistToFreePoint: number
    MaxPlayers: number
    MinDistToExitPoint: number
    MinDistToFreePoint: number
    MinMaxBots: any[]
    MinPlayers: number
    Name: string
    NewSpawn: boolean
    OcculsionCullingEnabled: boolean
    OldSpawn: boolean
    OpenZones: string
    Preview: Preview
    RequiredPlayerLevel: number
    Rules: string
    SafeLocation: boolean
    Scene: Preview
    SpawnPointParams: SpawnPointParam[]
    UnixDateTime: number
    _Id: string
    doors: any[]
    escape_time_limit: number
    exit_access_time: number
    exit_count: number
    exit_time: number
    exits: Exit[]
    filter_ex: any[]
    limits: any[]
    matching_min_seconds: number
    maxItemCountInLocation: any[]
    sav_summon_seconds: number
    tmp_location_field_remove_me: number
    users_gather_seconds: number
    users_spawn_seconds_n: number
    users_spawn_seconds_n2: number
    users_summon_seconds: number
    waves: Wave[]
}

interface AirdropParameter {
    AirdropPointDeactivateDistance: number
    MinPlayersCountToSpawnAirdrop: number
    PlaneAirdropChance: number
    PlaneAirdropCooldownMax: number
    PlaneAirdropCooldownMin: number
    PlaneAirdropEnd: number
    PlaneAirdropMax: number
    PlaneAirdropStartMax: number
    PlaneAirdropStartMin: number
    UnsuccessfulTryPenalty: number
}

interface Banner {
    id: string
    pic: Preview
}

interface Preview {
    path: string
    rcid: string
}

interface BossLocationSpawn {
    BossChance: number
    BossDifficult: BossDifficult
    BossEscortAmount: string
    BossEscortDifficult: BossDifficult
    BossEscortType: string
    BossName: string
    BossPlayer: boolean
    BossZone: string
    Supports: Support[] | null
    Time: number
    TriggerId: string
    TriggerName: string
}

enum BossDifficult {
    Hard = 'hard',
    Normal = 'normal'
}

interface Support {
    BossEscortAmount: string
    BossEscortDifficult: BossDifficult[]
    BossEscortType: string
}

interface BotLocationModifier {
    AccuracySpeed: number
    DistToActivate: number
    DistToPersueAxemanCoef: number
    DistToSleep: number
    GainSight: number
    KhorovodChance: number
    MarksmanAccuratyCoef: number
    Scattering: number
    VisibleDistance: number
}

interface SpawnPointParam {
    BotZoneName: string
    Categories: Category[]
    ColliderParams: ColliderParams
    DelayToCanSpawnSec: number
    Id: string
    Infiltration: Infiltration
    Position: Position
    Rotation: number
    Sides: Side[]
}

interface ColliderParams {
    _parent: Parent
    _props: Props
}

interface Props {
    Center: Position
    Radius?: number
    Size?: Position
}

interface Position {
    x: number
    y: number
    z: number
}

interface Exit {
    Chance: number
    Count: number
    EntryPoints: Infiltration
    ExfiltrationTime: number
    ExfiltrationType: string
    Id: string
    MaxTime: number
    MinTime: number
    Name: string
    PassageRequirement: string
    PlayersCount: number
    RequiredSlot: string
    RequirementTip: string
}

interface Wave {
    BotPreset: BossDifficult
    BotSide: Side
    SpawnPoints: string
    WildSpawnType: WildSpawnType
    isPlayers: boolean
    number: number
    slots_max: number
    slots_min: number
    time_max: number
    time_min: number
}

// Server Status Data
interface ServerStatus {
    currentStatuses: Status[]
    messages: StatusMessage[]
    generalStatus: Status
}

interface Status {
    name: string
    message: string
    status: number
    statusCode: string
}

interface StatusMessage {
    content: string
    time: string
    type: number
    solveTime: string
    statusCode: string
}

// Restock Data
interface TraderReset {
    name: string
    resetTimestamp: string
}

// Boss Data
type BossName = 'gluhar' | 'killa' | 'reshala' | 'sanitar' | 'shturman' | 'tagilla'

interface RawBoss {
    appearance: Appearance
    experience: Experience
    health: Health
    skills: Skills
    inventory: Inventory
    firstName: string[]
    lastName: any[]
    difficulty: Difficulty
    chances: Chances
    generation: Generation
}

interface Appearance {
    body: string[]
    feet: string[]
    hands: string[]
    head: string[]
    voice: string[]
}

interface Chances {
    equipment: { [key: string]: number }
    mods: { [key: string]: number }
}

interface Difficulty {
    easy: Easy
    normal: Easy
    hard: Easy
    impossible: Easy
}

interface Easy {
    Lay: Lay
    Aiming: { [key: string]: number }
    Look: Look
    Shoot: { [key: string]: number }
    Move: Move
    Grenade: Grenade
    Change: { [key: string]: number }
    Cover: Cover
    Patrol: Patrol
    Hearing: Hearing
    Mind: Mind
    Boss: Boss
    Core: Core
    Scattering: { [key: string]: number }
}

interface Boss {
    BOSS_DIST_TO_WARNING: number
    BOSS_DIST_TO_WARNING_SQRT: number
    BOSS_DIST_TO_WARNING_OUT: number
    BOSS_DIST_TO_WARNING_OUT_SQRT: number
    BOSS_DIST_TO_SHOOT: number
    BOSS_DIST_TO_SHOOT_SQRT: number
    CHANCE_TO_SEND_GRENADE_100: number
    MAX_DIST_COVER_BOSS: number
    MAX_DIST_COVER_BOSS_SQRT: number
    MAX_DIST_DECIDER_TO_SEND: number
    MAX_DIST_DECIDER_TO_SEND_SQRT: number
    TIME_AFTER_LOSE: number
    TIME_AFTER_LOSE_DELTA: number
    PERSONS_SEND: number
    DELTA_SEARCH_TIME: number
    COVER_TO_SEND: boolean
    WAIT_NO_ATTACK_SAVAGE: number
    CHANCE_USE_RESERVE_PATROL_100: number
    KILLA_Y_DELTA_TO_BE_ENEMY_BOSS: number
    KILLA_DITANCE_TO_BE_ENEMY_BOSS: number
    KILLA_START_SEARCH_SEC: number
    KILLA_CONTUTION_TIME: number
    KILLA_CLOSE_ATTACK_DIST: number
    KILLA_MIDDLE_ATTACK_DIST: number
    KILLA_LARGE_ATTACK_DIST: number
    KILLA_SEARCH_METERS: number
    KILLA_DEF_DIST_SQRT: number
    KILLA_SEARCH_SEC_STOP_AFTER_COMING: number
    KILLA_DIST_TO_GO_TO_SUPPRESS: number
    KILLA_AFTER_GRENADE_SUPPRESS_DELAY: number
    KILLA_CLOSEATTACK_TIMES: number
    KILLA_CLOSEATTACK_DELAY: number
    KILLA_HOLD_DELAY: number
    KILLA_BULLET_TO_RELOAD: number
    SHALL_WARN: boolean
    KILLA_ENEMIES_TO_ATTACK: number
    KILLA_ONE_IS_CLOSE: number
    KILLA_TRIGGER_DOWN_DELAY: number
    KILLA_WAIT_IN_COVER_COEF: number
    KOJANIY_DIST_WHEN_READY: number
    KOJANIY_DIST_TO_BE_ENEMY: number
    KOJANIY_MIN_DIST_TO_LOOT: number
    KOJANIY_MIN_DIST_TO_LOOT_SQRT: number
    KOJANIY_DIST_ENEMY_TOO_CLOSE: number
    KOJANIY_MANY_ENEMIES_COEF: number
    KOJANIY_FIGHT_CENTER_POS_ME: boolean
    KOJANIY_DIST_CORE_SPOS_RECALC: number
    KOJANIY_DIST_CORE_SPOS_RECALC_SQRT: number
    KOJANIY_START_SUPPERS_SHOOTS_SEC: number
    KOJANIY_START_NEXT_SUPPERS_SHOOTS_SEC: number
    KOJANIY_SAFE_ENEMIES: number
    KOJANIY_TAKE_CARE_ABOULT_ENEMY_DELTA: number
    KOJANIY_WANNA_GO_TO_CLOSEST_COVER: number
    GLUHAR_FOLLOWER_PATH_NAME: string
    GLUHAR_FOLLOWER_SCOUT_DIST_START_ATTACK: number
    GLUHAR_FOLLOWER_SCOUT_DIST_END_ATTACK: number
    GLUHAR_BOSS_WANNA_ATTACK_CHANCE_0_100: number
    GLUHAR_ASSAULT_ATTACK_DIST: number
    GLUHAR_STOP_ASSAULT_ATTACK_DIST: number
    GLUHAR_TIME_TO_ASSAULT: number
    DIST_TO_PROTECT_BOSS: number
    GLUHAR_SEC_TO_REINFORSMENTS: number
    GLUHAR_REINFORSMENTS_BY_EXIT: boolean
    GLUHAR_REINFORSMENTS_BY_EVENT: boolean
    GLUHAR_REINFORSMENTS_BY_PLAYER_COME_TO_ZONE: boolean
    GLUHAR_FOLLOWERS_TO_REINFORSMENTS: number
    GLUHAR_FOLLOWERS_SECURITY: number
    GLUHAR_FOLLOWERS_ASSAULT: number
    GLUHAR_FOLLOWERS_SCOUT: number
    GLUHAR_FOLLOWERS_SNIPE: number
    GLUHAR_BOSS_DIST_TO_ENEMY_WANT_KILL: number
    EFFECT_PAINKILLER: boolean
}

interface Core {
    VisibleAngle: number
    VisibleDistance: number
    GainSightCoef: number
    ScatteringPerMeter: number
    ScatteringClosePerMeter: number
    DamageCoeff: number
    HearingSense: number
    CanRun: boolean
    CanGrenade: boolean
    AimingType: string
    PistolFireDistancePref: number
    ShotgunFireDistancePref: number
    RifleFireDistancePref: number
    AccuratySpeed: number
    WaitInCoverBetweenShotsSec: number
}

interface Cover {
    RETURN_TO_ATTACK_AFTER_AMBUSH_MIN: number
    RETURN_TO_ATTACK_AFTER_AMBUSH_MAX: number
    SOUND_TO_GET_SPOTTED: number
    TIME_TO_MOVE_TO_COVER: number
    MAX_DIST_OF_COVER: number
    CHANGE_RUN_TO_COVER_SEC: number
    CHANGE_RUN_TO_COVER_SEC_GREANDE: number
    MIN_DIST_TO_ENEMY: number
    DIST_CANT_CHANGE_WAY: number
    DIST_CHECK_SFETY: number
    TIME_CHECK_SAFE: number
    HIDE_TO_COVER_TIME: number
    MAX_DIST_OF_COVER_SQR: number
    DIST_CANT_CHANGE_WAY_SQR: number
    SPOTTED_COVERS_RADIUS: number
    LOOK_LAST_ENEMY_POS_MOVING: number
    LOOK_TO_HIT_POINT_IF_LAST_ENEMY: number
    LOOK_LAST_ENEMY_POS_LOOKAROUND: number
    OFFSET_LOOK_ALONG_WALL_ANG: number
    SPOTTED_GRENADE_RADIUS: number
    MAX_SPOTTED_TIME_SEC: number
    WAIT_INT_COVER_FINDING_ENEMY: number
    CLOSE_DIST_POINT_SQRT: number
    DELTA_SEEN_FROM_COVE_LAST_POS: number
    MOVE_TO_COVER_WHEN_TARGET: boolean
    RUN_COVER_IF_CAN_AND_NO_ENEMIES: boolean
    SPOTTED_GRENADE_TIME: number
    DEPENDS_Y_DIST_TO_BOT: boolean
    RUN_IF_FAR: number
    RUN_IF_FAR_SQRT: number
    STAY_IF_FAR: number
    STAY_IF_FAR_SQRT: number
    CHECK_COVER_ENEMY_LOOK: boolean
    SHOOT_NEAR_TO_LEAVE: number
    SHOOT_NEAR_SEC_PERIOD: number
    HITS_TO_LEAVE_COVER: number
    HITS_TO_LEAVE_COVER_UNKNOWN: number
    DOG_FIGHT_AFTER_LEAVE: number
    NOT_LOOK_AT_WALL_IS_DANGER: boolean
    MIN_DEFENCE_LEVEL: number
    REWORK_NOT_TO_SHOOT: boolean
    DELETE_POINTS_BEHIND_ENEMIES: boolean
    GOOD_DIST_TO_POINT_COEF: number
    ENEMY_DIST_TO_GO_OUT: number
    CHECK_CLOSEST_FRIEND: boolean
    MIN_TO_ENEMY_TO_BE_NOT_SAFE_SQRT: number
    MIN_TO_ENEMY_TO_BE_NOT_SAFE: number
    CAN_LOOK_OUT_WHEN_HOLDING: boolean
    SIT_DOWN_WHEN_HOLDING: boolean
    STATIONARY_WEAPON_NO_ENEMY_GETUP: number
    STATIONARY_WEAPON_MAX_DIST_TO_USE: number
}

interface Grenade {
    DELTA_NEXT_ATTEMPT_FROM_COVER: number
    DELTA_NEXT_ATTEMPT: number
    MIN_DIST_NOT_TO_THROW: number
    NEAR_DELTA_THROW_TIME_SEC: number
    MIN_THROW_GRENADE_DIST: number
    MIN_THROW_GRENADE_DIST_SQRT: number
    MIN_DIST_NOT_TO_THROW_SQR: number
    RUN_AWAY: number
    RUN_AWAY_SQR: number
    ADD_GRENADE_AS_DANGER: number
    ADD_GRENADE_AS_DANGER_SQR: number
    CHANCE_TO_NOTIFY_ENEMY_GR_100: number
    GrenadePerMeter: number
    REQUEST_DIST_MUST_THROW_SQRT: number
    REQUEST_DIST_MUST_THROW: number
    BEWARE_TYPE: number
    SHOOT_TO_SMOKE_CHANCE_100: number
    CHANCE_RUN_FLASHED_100: number
    MAX_FLASHED_DIST_TO_SHOOT: number
    MAX_FLASHED_DIST_TO_SHOOT_SQRT: number
    FLASH_GRENADE_TIME_COEF: number
    SIZE_SPOTTED_COEF: number
    BE_ATTENTION_COEF: number
    TIME_SHOOT_TO_FLASH: number
    CLOSE_TO_SMOKE_TO_SHOOT: number
    CLOSE_TO_SMOKE_TO_SHOOT_SQRT: number
    CLOSE_TO_SMOKE_TIME_DELTA: number
    SMOKE_CHECK_DELTA: number
    DELTA_GRENADE_START_TIME: number
    AMBUSH_IF_SMOKE_IN_ZONE_100: number
    AMBUSH_IF_SMOKE_RETURN_TO_ATTACK_SEC: number
    NO_RUN_FROM_AI_GRENADES: boolean
    MAX_THROW_POWER: number
    GrenadePrecision: number
    STOP_WHEN_THROW_GRENADE: boolean
    WAIT_TIME_TURN_AWAY: number
    SMOKE_SUPPRESS_DELTA: number
    DAMAGE_GRENADE_SUPPRESS_DELTA: number
    STUN_SUPPRESS_DELTA: number
    CHEAT_START_GRENADE_PLACE: boolean
    CAN_THROW_STRAIGHT_CONTACT: boolean
    STRAIGHT_CONTACT_DELTA_SEC: number
    ANG_TYPE: number
    MIN_THROW_DIST_PERCENT_0_1: number
    FLASH_MODIF_IS_NIGHTVISION: number
}

interface Hearing {
    BOT_CLOSE_PANIC_DIST: number
    CHANCE_TO_HEAR_SIMPLE_SOUND_0_1: number
    DISPERSION_COEF: number
    DISPERSION_COEF_GUN: number
    CLOSE_DIST: number
    FAR_DIST: number
    SOUND_DIR_DEEFREE: number
    DIST_PLACE_TO_FIND_POINT: number
    DEAD_BODY_SOUND_RAD: number
    LOOK_ONLY_DANGER: boolean
    RESET_TIMER_DIST: number
    HEAR_DELAY_WHEN_PEACE: number
    HEAR_DELAY_WHEN_HAVE_SMT: number
    LOOK_ONLY_DANGER_DELTA: number
}

interface Lay {
    CHECK_SHOOT_WHEN_LAYING: boolean
    DELTA_LAY_CHECK: number
    DELTA_GETUP: number
    DELTA_AFTER_GETUP: number
    CLEAR_POINTS_OF_SCARE_SEC: number
    MAX_LAY_TIME: number
    DELTA_WANT_LAY_CHECL_SEC: number
    ATTACK_LAY_CHANCE: number
    DIST_TO_COVER_TO_LAY: number
    DIST_TO_COVER_TO_LAY_SQRT: number
    DIST_GRASS_TERRAIN_SQRT: number
    DIST_ENEMY_NULL_DANGER_LAY: number
    DIST_ENEMY_NULL_DANGER_LAY_SQRT: number
    DIST_ENEMY_GETUP_LAY: number
    DIST_ENEMY_GETUP_LAY_SQRT: number
    DIST_ENEMY_CAN_LAY: number
    DIST_ENEMY_CAN_LAY_SQRT: number
    LAY_AIM: number
    MIN_CAN_LAY_DIST_SQRT: number
    MIN_CAN_LAY_DIST: number
    MAX_CAN_LAY_DIST_SQRT: number
    MAX_CAN_LAY_DIST: number
    LAY_CHANCE_DANGER: number
    DAMAGE_TIME_TO_GETUP: number
}

interface Look {
    OLD_TIME_POINT: number
    WAIT_NEW_SENSOR: number
    WAIT_NEW__LOOK_SENSOR: number
    LOOK_AROUND_DELTA: number
    MAX_VISION_GRASS_METERS: number
    MAX_VISION_GRASS_METERS_FLARE: number
    MAX_VISION_GRASS_METERS_OPT: number
    MAX_VISION_GRASS_METERS_FLARE_OPT: number
    LightOnVisionDistance: number
    FAR_DISTANCE: number
    FarDeltaTimeSec: number
    MIDDLE_DIST: number
    MiddleDeltaTimeSec: number
    CloseDeltaTimeSec: number
    POSIBLE_VISION_SPACE: number
    GOAL_TO_FULL_DISSAPEAR: number
    GOAL_TO_FULL_DISSAPEAR_SHOOT: number
    BODY_DELTA_TIME_SEARCH_SEC: number
    COME_TO_BODY_DIST: number
    MARKSMAN_VISIBLE_DIST_COEF: number
    VISIBLE_DISNACE_WITH_LIGHT: number
    ENEMY_LIGHT_ADD: number
    ENEMY_LIGHT_START_DIST: number
    CAN_LOOK_TO_WALL: boolean
    DIST_NOT_TO_IGNORE_WALL: number
    DIST_CHECK_WALL: number
    LOOK_LAST_POSENEMY_IF_NO_DANGER_SEC: number
    MIN_LOOK_AROUD_TIME: number
    OPTIMIZE_TO_ONLY_BODY: boolean
    LOOK_THROUGH_GRASS: boolean
    LOOK_THROUGH_GRASS_DIST_METERS: number
    SEC_REPEATED_SEEN: number
    DIST_SQRT_REPEATED_SEEN: number
    DIST_REPEATED_SEEN: number
    COEF_REPEATED_SEEN: number
    MAX_DIST_CLAMP_TO_SEEN_SPEED: number
    NIGHT_VISION_ON: number
    NIGHT_VISION_OFF: number
    NIGHT_VISION_DIST: number
    VISIBLE_ANG_LIGHT: number
    VISIBLE_ANG_NIGHTVISION: number
}

interface Mind {
    MIN_SHOOTS_TIME: number
    MAX_SHOOTS_TIME: number
    TIME_TO_RUN_TO_COVER_CAUSE_SHOOT_SEC: number
    DAMAGE_REDUCTION_TIME_SEC: number
    MIN_DAMAGE_SCARE: number
    CHANCE_TO_RUN_CAUSE_DAMAGE_0_100: number
    TIME_TO_FORGOR_ABOUT_ENEMY_SEC: number
    TIME_TO_FIND_ENEMY: number
    MAX_AGGRO_BOT_DIST: number
    HIT_POINT_DETECTION: number
    DANGER_POINT_CHOOSE_COEF: number
    SIMPLE_POINT_CHOOSE_COEF: number
    LASTSEEN_POINT_CHOOSE_COEF: number
    COVER_DIST_COEF: number
    DIST_TO_FOUND_SQRT: number
    MAX_AGGRO_BOT_DIST_SQR: number
    DIST_TO_STOP_RUN_ENEMY: number
    ENEMY_LOOK_AT_ME_ANG: number
    MIN_START_AGGRESION_COEF: number
    MAX_START_AGGRESION_COEF: number
    BULLET_FEEL_DIST: number
    BULLET_FEEL_CLOSE_SDIST: number
    ATTACK_IMMEDIATLY_CHANCE_0_100: number
    CHANCE_FUCK_YOU_ON_CONTACT_100: number
    FRIEND_DEAD_AGR_LOW: number
    FRIEND_AGR_KILL: number
    LAST_ENEMY_LOOK_TO: number
    CAN_RECEIVE_PLAYER_REQUESTS_SAVAGE: boolean
    CAN_RECEIVE_PLAYER_REQUESTS_BEAR: boolean
    CAN_RECEIVE_PLAYER_REQUESTS_USEC: boolean
    CAN_USE_MEDS: boolean
    SUSPETION_POINT_CHANCE_ADD100: number
    AMBUSH_WHEN_UNDER_FIRE: boolean
    AMBUSH_WHEN_UNDER_FIRE_TIME_RESIST: number
    ATTACK_ENEMY_IF_PROTECT_DELTA_LAST_TIME_SEEN: number
    HOLD_IF_PROTECT_DELTA_LAST_TIME_SEEN: number
    FIND_COVER_TO_GET_POSITION_WITH_SHOOT: number
    PROTECT_TIME_REAL: boolean
    CHANCE_SHOOT_WHEN_WARN_PLAYER_100: number
    CAN_PANIC_IS_PROTECT: boolean
    NO_RUN_AWAY_FOR_SAFE: boolean
    PART_PERCENT_TO_HEAL: number
    PROTECT_DELTA_HEAL_SEC: number
    CAN_STAND_BY: boolean
    CAN_THROW_REQUESTS: boolean
    GROUP_ANY_PHRASE_DELAY: number
    GROUP_EXACTLY_PHRASE_DELAY: number
    DIST_TO_ENEMY_YO_CAN_HEAL: number
    CHANCE_TO_STAY_WHEN_WARN_PLAYER_100: number
    DOG_FIGHT_OUT: number
    DOG_FIGHT_IN: number
    SHOOT_INSTEAD_DOG_FIGHT: number
    PISTOL_SHOTGUN_AMBUSH_DIST: number
    STANDART_AMBUSH_DIST: number
    AI_POWER_COEF: number
    COVER_SECONDS_AFTER_LOSE_VISION: number
    COVER_SELF_ALWAYS_IF_DAMAGED: boolean
    SEC_TO_MORE_DIST_TO_RUN: number
    HEAL_DELAY_SEC: number
    HIT_DELAY_WHEN_HAVE_SMT: number
    HIT_DELAY_WHEN_PEACE: number
    TALK_WITH_QUERY: boolean
    DANGER_EXPIRE_TIME_MIN: number
    DANGER_EXPIRE_TIME_MAX: number
    PANIC_RUN_WEIGHT: number
    PANIC_SIT_WEIGHT: number
    PANIC_LAY_WEIGHT: number
    PANIC_NONE_WEIGHT: number
    PANIC_SIT_WEIGHT_PEACE: number
    CAN_EXECUTE_REQUESTS: boolean
    CAN_TAKE_ITEMS: boolean
    DIST_TO_ENEMY_SPOTTED_ON_HIT: number
    DEFAULT_ENEMY_USEC: boolean
    DEFAULT_ENEMY_BEAR: boolean
}

interface Move {
    BASE_ROTATE_SPEED: number
    REACH_DIST: number
    REACH_DIST_RUN: number
    START_SLOW_DIST: number
    BASESTART_SLOW_DIST: number
    SLOW_COEF: number
    DIST_TO_CAN_CHANGE_WAY: number
    DIST_TO_START_RAYCAST: number
    BASE_START_SERACH: number
    UPDATE_TIME_RECAL_WAY: number
    FAR_DIST: number
    FAR_DIST_SQR: number
    DIST_TO_CAN_CHANGE_WAY_SQR: number
    DIST_TO_START_RAYCAST_SQR: number
    BASE_SQRT_START_SERACH: number
    Y_APPROXIMATION: number
    DELTA_LAST_SEEN_ENEMY: number
    REACH_DIST_COVER: number
    RUN_TO_COVER_MIN: number
    CHANCE_TO_RUN_IF_NO_AMMO_0_100: number
    RUN_IF_CANT_SHOOT: boolean
    RUN_IF_GAOL_FAR_THEN: number
    SEC_TO_CHANGE_TO_RUN: number
    ETERNITY_STAMINA: boolean
}

interface Patrol {
    LOOK_TIME_BASE: number
    RESERVE_TIME_STAY: number
    FRIEND_SEARCH_SEC: number
    TALK_DELAY: number
    MIN_TALK_DELAY: number
    TALK_DELAY_BIG: number
    CHANGE_WAY_TIME: number
    MIN_DIST_TO_CLOSE_TALK: number
    VISION_DIST_COEF_PEACE: number
    MIN_DIST_TO_CLOSE_TALK_SQR: number
    CHANCE_TO_CUT_WAY_0_100: number
    CUT_WAY_MIN_0_1: number
    CUT_WAY_MAX_0_1: number
    CHANCE_TO_CHANGE_WAY_0_100: number
    CHANCE_TO_SHOOT_DEADBODY: number
    SUSPETION_PLACE_LIFETIME: number
    RESERVE_OUT_TIME: number
    CLOSE_TO_SELECT_RESERV_WAY: number
    MAX_YDIST_TO_START_WARN_REQUEST_TO_REQUESTER: number
    CAN_CHOOSE_RESERV: boolean
    TRY_CHOOSE_RESERV_WAY_ON_START: boolean
}

interface Experience {
    level: BeijingPigeon
    reward: BeijingPigeon
    standingForKill: number
    aggressorBonus: number
}

interface BeijingPigeon {
    min: number
    max: number
}

interface Generation {
    items: GenerationItems
}

interface GenerationItems {
    specialItems: BeijingPigeon
    healing: BeijingPigeon
    looseLoot: BeijingPigeon
    magazines: BeijingPigeon
    grenades: BeijingPigeon
}

interface Health {
    Hydration: BeijingPigeon
    Energy: BeijingPigeon
    Temperature: BeijingPigeon
    BodyParts: BodyPart[]
}

interface BodyPart {
    Head: BeijingPigeon
    Chest: BeijingPigeon
    Stomach: BeijingPigeon
    LeftArm: BeijingPigeon
    RightArm: BeijingPigeon
    LeftLeg: BeijingPigeon
    RightLeg: BeijingPigeon
}

interface Inventory {
    equipment: { [key: string]: string[] }
    mods: Mods
    items: InventoryItems
}

interface InventoryItems {
    TacticalVest: string[]
    Pockets: string[]
    Backpack: string[]
    SecuredContainer: string[]
    SpecialLoot: any[]
}

interface Mods {
    '5cadfbf7ae92152ac412eeef': The5Cadfbf7Ae92152Ac412Eeef
    '5cdaa99dd7f00c002412d0b2': The5Cdaa99Dd7F00C002412D0B2
    '5caf1691ae92152ac412efb9': The59985_A6C86F77414Ec448D17
    '5e81c3cbac2bb513793cdc75': The5_E81C3Cbac2Bb513793Cdc75
    '5e81edc13397a21db957f6a1': The5_E81Edc13397A21Db957F6A1
    '5b432d215acfc4771e1c6624': The5_A16B8A9Fcdbcb00165Aa6CA
    '5a16b8a9fcdbcb00165aa6ca': The5_A16B8A9Fcdbcb00165Aa6CA
    '5a16b93dfcdbcbcae6687261': The5_A16B8A9Fcdbcb00165Aa6CA
    '5caf1109ae9215753c44119f': The599860_Ac86F77436B225Ed1A
    '5e81c4ca763d9f754677befa': The599860_Ac86F77436B225Ed1A
    '5aafa857e5b5b00018480968': The5Aafa857E5B5B00018480968
    '5addc7005acfc4001669f275': The5Addc7005Acfc4001669F275
    '5addc7ac5acfc400194dbd90': The5Addc7Ac5Acfc400194Dbd90
    '5addbffe5acfc4001714dfac': The59985_A6C86F77414Ec448D17
    '5b3b99265acfc4704b4a1afb': The59985_A6C86F77414Ec448D17
    '5addbac75acfc400194dbc56': The5_Addbac75Acfc400194Dbc56
    '59984ab886f7743e98271174': The59984Ab886F7743E98271174
    '5ac78eaf5acfc4001926317a': The5Ac78Eaf5Acfc4001926317A
    '59985a6c86f77414ec448d17': The59985_A6C86F77414Ec448D17
    '59ccd11386f77428f24a488f': The59Ccd11386F77428F24A488F
    '5648b4534bdc2d3d1c8b4580': The5648B4534Bdc2D3D1C8B4580
    '602a9740da11d6478d5a06dc': The602A9740Da11D6478D5A06Dc
    '60228924961b8d75ee233c32': The5_E81Edc13397A21Db957F6A1
    '5c0695860db834001b735461': The5_A16B8A9Fcdbcb00165Aa6CA
    '5aaf8a0be5b5b00015693243': The599860_Ac86F77436B225Ed1A
    '599860ac86f77436b225ed1a': The599860_Ac86F77436B225Ed1A
    '602286df23506e50807090c6': The599860_Ac86F77436B225Ed1A
    '5a17f98cfcdbcb0980087290': The5A17F98Cfcdbcb0980087290
    '5a17fb03fcdbcbcae668728f': The599860_Ac86F77436B225Ed1A
    '5c066ef40db834001966a595': The5_A16B8A9Fcdbcb00165Aa6CA
    '5c7954d52e221600106f4cc7': The5_Addbac75Acfc400194Dbc56
    '5a16bb52fcdbcb001a3b00dc': The5_A16B8A9Fcdbcb00165Aa6CA
    '5abccb7dd8ce87001773e277': The5Abccb7Dd8Ce87001773E277
    '5ea17ca01412a1425304d1c0': The5_A16B8A9Fcdbcb00165Aa6CA
    '5f36a0e5fbf956000b716b65': The5_E81C3Cbac2Bb513793Cdc75
    '5f3e7823ddc4f03b010e2045': The5_E81Edc13397A21Db957F6A1
    '5f3e77b26cda304dcc634057': The599860_Ac86F77436B225Ed1A
    '6193a720f8ee7e52e42109ed': The5_E81C3Cbac2Bb513793Cdc75
    '6194f5d418a3974e5e7421ef': The5_E81Edc13397A21Db957F6A1
    '6193d3149fb0c665d5490e32': The599860_Ac86F77436B225Ed1A
}

interface The5648B4534Bdc2D3D1C8B4580 {
    mod_foregrip: string[]
    mod_tactical_001: string[]
}

interface The59984Ab886F7743E98271174 {
    mod_pistol_grip: string[]
    mod_stock: string[]
    mod_charge: string[]
    mod_muzzle: string[]
    mod_reciever: string[]
    mod_sight_rear: string[]
    mod_gas_block: string[]
    mod_magazine: string[]
}

interface The59985_A6C86F77414Ec448D17 {
    mod_scope: string[]
}

interface The599860_Ac86F77436B225Ed1A {
    cartridges: string[]
}

interface The59Ccd11386F77428F24A488F {
    mod_handguard: string[]
}

interface The5_A16B8A9Fcdbcb00165Aa6CA {
    mod_nvg: string[]
}

interface The5A17F98Cfcdbcb0980087290 {
    mod_pistol_grip: string[]
    mod_sight_front: string[]
    mod_sight_rear: string[]
    mod_magazine: string[]
}

interface The5Aafa857E5B5B00018480968 {
    mod_stock: string[]
    mod_barrel: string[]
    mod_magazine: string[]
    patron_in_weapon: string[]
}

interface The5Abccb7Dd8Ce87001773E277 {
    mod_stock: string[]
    mod_pistol_grip: string[]
    mod_sight_front: string[]
    mod_sight_rear: string[]
    mod_muzzle: string[]
    mod_magazine: string[]
}

interface The5Ac78Eaf5Acfc4001926317A {
    mod_stock: string[]
}

interface The5_Addbac75Acfc400194Dbc56 {
    mod_muzzle: string[]
}

interface The5Addc7005Acfc4001669F275 {
    mod_stock: string[]
    mod_scope: string[]
    mod_tactical_001: string[]
}

interface The5Addc7Ac5Acfc400194Dbd90 {
    mod_pistol_grip: string[]
}

interface The5Cadfbf7Ae92152Ac412Eeef {
    mod_sight_front: string[]
    mod_handguard: string[]
    mod_muzzle: string[]
    mod_scope: string[]
    mod_magazine: string[]
}

interface The5Cdaa99Dd7F00C002412D0B2 {
    mod_foregrip: string[]
}

interface The5_E81C3Cbac2Bb513793Cdc75 {
    mod_barrel: string[]
    mod_pistol_grip?: string[]
    mod_reciever: string[]
    mod_trigger: string[]
    mod_hammer: string[]
    mod_catch: string[]
    mod_magazine: string[]
    mod_mount_000?: string[]
}

interface The5_E81Edc13397A21Db957F6A1 {
    mod_sight_rear: string[]
    mod_sight_front: string[]
}

interface The602A9740Da11D6478D5A06Dc {
    mod_barrel: string[]
    mod_reciever: string[]
    mod_magazine: string[]
}

interface Skills {
    Common: Common
}

interface Common {
    Endurance: BeijingPigeon
    Strength: BeijingPigeon
    BotReload: BeijingPigeon
    Charisma: BeijingPigeon
}
