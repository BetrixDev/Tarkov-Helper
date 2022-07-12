export interface GameMap {
    enabled: boolean;
    locked: boolean;
    insurance: boolean;
    safeLocation: boolean;
    name: string;
    description?: string;
    scene: Preview;
    area: number;
    requiredPlayerLevel: number;
    minPlayers: number;
    maxPlayers: number;
    exitCount: number;
    exitAccessTime: number;
    exitTime: number;
    preview?: Preview;
    iconX: number;
    iconY: number;
    filterEx?: any[];
    waves: Wave[];
    limits: any[];
    averagePlayTime: number;
    averagePlayerLevel: number;
    escapeTimeLimit: number;
    rules: string;
    isSecret: boolean;
    doors: any[];
    tmpLocationFieldRemoveMe: number;
    minDistToExitPoint: number;
    maxDistToFreePoint: number;
    minDistToFreePoint: number;
    maxBotPerZone: number;
    openZones: string;
    occulsionCullingEnabled: boolean;
    globalLootChanceModifier: number;
    oldSpawn: boolean;
    newSpawn: boolean;
    botMax: number;
    botStart: number;
    botStop: number;
    botMaxTimePlayer: number;
    botSpawnTimeOnMin: number;
    botSpawnTimeOnMax: number;
    botSpawnTimeOffMin: number;
    botSpawnTimeOffMax: number;
    botMaxPlayer: number;
    botEasy: number;
    botNormal: number;
    botHard: number;
    botImpossible: number;
    botAssault: number;
    botMarksman: number;
    disabledScavExits: string;
    accessKeys: string[];
    unixDateTime: number;
    usersGatherSeconds: number;
    usersSpawnSecondsN: number;
    usersSpawnSecondsN2: number;
    usersSummonSeconds: number;
    savSummonSeconds: number;
    matchingMinSeconds: number;
    minMaxBots: MinMaxBot[];
    botLocationModifier: BotLocationModifier;
    exits: Exit[];
    disabledForScav: boolean;
    bossLocationSpawn: BossLocationSpawn[];
    spawnPointParams: SpawnPointParam[];
    maxItemCountInLocation: MaxItemCountInLocation[];
    id: string;
    gameMapID: string;
    loot: any[];
    banners: Banner[];
}

interface Banner {
    id: string;
    pic: Preview;
}

interface Preview {
    path: string;
    rcid: string;
}

interface BossLocationSpawn {
    bossName: string;
    bossChance: number;
    bossZone: string;
    bossPlayer: boolean;
    bossDifficult: BossDifficult;
    bossEscortType: string;
    bossEscortDifficult: BossDifficult;
    bossEscortAmount: string;
    time: number;
    triggerID?: string;
    triggerName?: TriggerName;
    delay?: number;
    supports?: Support[] | null;
}

declare enum BossDifficult {
    Easy = "easy",
    Hard = "hard",
    Normal = "normal"
}

interface Support {
    bossEscortType: string;
    bossEscortDifficult: BossDifficult[];
    bossEscortAmount: string;
}

declare enum TriggerName {
    Empty = "",
    InteractObject = "interactObject"
}

interface BotLocationModifier {
    accuracySpeed: number;
    scattering: number;
    gainSight: number;
    marksmanAccuratyCoef: number;
    visibleDistance: number;
    distToActivate?: number;
    distToSleep?: number;
    magnetPower?: number;
    distToPersueAxemanCoef: number;
    khorovodChance: number;
}

interface Exit {
    name: string;
    entryPoints: string;
    chance: number;
    minTime: number;
    maxTime: number;
    playersCount: number;
    exfiltrationTime: number;
    passageRequirement?: string;
    exfiltrationType?: ExfiltrationType;
    id: string;
    count?: number;
    requirementTip?: string;
    requiredSlot?: RequiredSlot;
}

declare enum ExfiltrationType {
    Individual = "Individual",
    Manual = "Manual",
    SharedTimer = "SharedTimer"
}

declare enum RequiredSlot {
    Backpack = "Backpack",
    FirstPrimaryWeapon = "FirstPrimaryWeapon"
}

interface MaxItemCountInLocation {
    templateID: string;
    value: number;
}

interface MinMaxBot {
    min: number;
    max: number;
    wildSpawnType: WildSpawnType;
}

declare enum WildSpawnType {
    Assault = "assault",
    Marksman = "marksman"
}

interface SpawnPointParam {
    id: string;
    position: Position;
    rotation: number;
    sides: Side[];
    categories: Category[];
    infiltration: string;
    delayToCanSpawnSEC: number;
    colliderParams: ColliderParams;
    botZoneName: string;
}

declare enum Category {
    Boss = "Boss",
    Bot = "Bot",
    Player = "Player"
}

interface ColliderParams {
    parent: Parent;
    props: Props;
}

declare enum Parent {
    SpawnBoxParams = "SpawnBoxParams",
    SpawnSphereParams = "SpawnSphereParams"
}

interface Props {
    center: Position;
    radius?: number;
    size?: Position;
}

interface Position {
    x: number;
    y: number;
    z: number;
}

declare enum Side {
    All = "All",
    Bear = "Bear",
    Savage = "Savage",
    Usec = "Usec"
}

interface Wave {
    number: number;
    timeMin: number;
    timeMax: number;
    slotsMin: number;
    slotsMax: number;
    spawnPoints: string;
    botSide: Side;
    botPreset: BossDifficult;
    wildSpawnType: WildSpawnType;
    isPlayers: boolean;
    openZones?: string;
}
