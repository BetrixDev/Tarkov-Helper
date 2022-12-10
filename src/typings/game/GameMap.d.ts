export interface GameMap {
    Enabled: boolean;
    EnabledCoop: boolean;
    Locked: boolean;
    Insurance: boolean;
    SafeLocation: boolean;
    Name: string;
    Description: string;
    Scene: Preview;
    Area: number;
    RequiredPlayerLevel: number;
    PmcMaxPlayersInGroup: number;
    ScavMaxPlayersInGroup: number;
    MinPlayers: number;
    MaxCoopGroup: number;
    MaxPlayers: number;
    exit_count: number;
    exit_access_time: number;
    exit_time: number;
    Preview: Preview;
    IconX: number;
    IconY: number;
    filter_ex: any[];
    waves: Wave[];
    limits: any[];
    AveragePlayTime: number;
    AveragePlayerLevel: number;
    EscapeTimeLimit: number;
    EscapeTimeLimitCoop: number;
    Rules: string;
    IsSecret: boolean;
    doors: any[];
    tmp_location_field_remove_me: number;
    MinDistToExitPoint: number;
    MaxDistToFreePoint: number;
    MinDistToFreePoint: number;
    MaxBotPerZone: number;
    OpenZones: string;
    OcculsionCullingEnabled: boolean;
    GlobalLootChanceModifier: number;
    OldSpawn: boolean;
    NewSpawn: boolean;
    BotMax: number;
    BotStart: number;
    BotStop: number;
    BotMaxTimePlayer: number;
    BotSpawnTimeOnMin: number;
    BotSpawnTimeOnMax: number;
    BotSpawnTimeOffMin: number;
    BotSpawnTimeOffMax: number;
    BotMaxPlayer: number;
    BotEasy: number;
    BotNormal: number;
    BotHard: number;
    BotImpossible: number;
    BotAssault: number;
    BotMarksman: number;
    DisabledScavExits: string;
    AccessKeys: any[];
    UnixDateTime: number;
    users_gather_seconds: number;
    users_spawn_seconds_n: number;
    users_spawn_seconds_n2: number;
    users_summon_seconds: number;
    sav_summon_seconds: number;
    matching_min_seconds: number;
    MinMaxBots: any[];
    BotLocationModifier: BotLocationModifier;
    exits: Exit[];
    DisabledForScav: boolean;
    BossLocationSpawn: BossLocationSpawn[];
    SpawnPointParams: SpawnPointParam[];
    maxItemCountInLocation: any[];
    Id: string;
    _Id: string;
    Loot: any[];
    Banners: Banner[];
    GenerateLocalLootCache: boolean;
    AirdropParameters: AirdropParameter[];
}

export interface AirdropParameter {
    PlaneAirdropStartMin: number;
    PlaneAirdropStartMax: number;
    PlaneAirdropEnd: number;
    PlaneAirdropChance: number;
    PlaneAirdropMax: number;
    PlaneAirdropCooldownMin: number;
    PlaneAirdropCooldownMax: number;
    AirdropPointDeactivateDistance: number;
    MinPlayersCountToSpawnAirdrop: number;
    UnsuccessfulTryPenalty: number;
}

export interface Banner {
    id: string;
    pic: Preview;
}

export interface Preview {
    path: string;
    rcid: string;
}

export interface BossLocationSpawn {
    BossName: string;
    BossChance: number;
    BossZone: string;
    BossPlayer: boolean;
    BossDifficult: BossDifficult;
    BossEscortType: string;
    BossEscortDifficult: BossDifficult;
    BossEscortAmount: string;
    Time: number;
    TriggerId: string;
    TriggerName: string;
    Supports: Support[] | null;
    RandomTimeSpawn: boolean;
}

export enum BossDifficult {
    Hard = "hard",
    Normal = "normal"
}

export interface Support {
    BossEscortType: string;
    BossEscortDifficult: BossDifficult[];
    BossEscortAmount: string;
}

export interface BotLocationModifier {
    AccuracySpeed: number;
    Scattering: number;
    GainSight: number;
    MarksmanAccuratyCoef: number;
    VisibleDistance: number;
    DistToPersueAxemanCoef: number;
    DistToSleep: number;
    DistToActivate: number;
    KhorovodChance: number;
}

export interface SpawnPointParam {
    Id: string;
    Position: Position;
    Rotation: number;
    Sides: Side[];
    Categories: Category[];
    Infiltration: Infiltration;
    DelayToCanSpawnSec: number;
    ColliderParams: ColliderParams;
    BotZoneName: string;
}

export enum Category {
    Boss = "Boss",
    Bot = "Bot",
    Coop = "Coop",
    Player = "Player"
}

export interface ColliderParams {
    _parent: Parent;
    _props: Props;
}

export enum Parent {
    SpawnSphereParams = "SpawnSphereParams"
}

export interface Props {
    Center: Position;
    Radius: number;
}

export interface Position {
    x: number;
    y: number;
    z: number;
}

export enum Infiltration {
    Empty = "",
    North = "North",
    Tunnel = "Tunnel"
}

export enum Side {
    All = "All",
    Bear = "Bear",
    Savage = "Savage",
    Usec = "Usec"
}

export interface Exit {
    Name: string;
    EntryPoints: string;
    Chance: number;
    MinTime: number;
    MaxTime: number;
    PlayersCount: number;
    ExfiltrationTime: number;
    PassageRequirement: string;
    ExfiltrationType: string;
    RequiredSlot: string;
    Id: string;
    RequirementTip: string;
    Count: number;
}

export interface Wave {
    number: number;
    time_min: number;
    time_max: number;
    slots_min: number;
    slots_max: number;
    SpawnPoints: string;
    BotSide: Side;
    BotPreset: BossDifficult;
    WildSpawnType: WildSpawnType;
    isPlayers: boolean;
}

export enum WildSpawnType {
    Assault = "assault",
    Marksman = "marksman"
}
