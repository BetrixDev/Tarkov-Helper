export interface RawMapData {
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

const enum Category {
    Bot = 'Bot',
    Player = 'Player'
}

const enum Parent {
    SpawnBoxParams = 'SpawnBoxParams',
    SpawnSphereParams = 'SpawnSphereParams'
}

const enum Side {
    All = 'All',
    Savage = 'Savage'
}

const enum Infiltration {
    Common = 'Common',
    Empty = ''
}

const enum WildSpawnType {
    Assault = 'assault'
}
