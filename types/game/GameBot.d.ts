export interface GameBot {
    appearance: Appearance;
    chances: Chances;
    difficulty: Difficulty;
    experience: Experience;
    firstName: string[];
    generation: Generation;
    health: Health;
    inventory: Inventory;
    lastName: any[];
    skills: Skills;
}

interface Appearance {
    body: string[];
    feet: string[];
    hands: string[];
    head: string[];
    voice: string[];
}

interface Chances {
    equipment: { [key: string]: number };
    mods: { [key: string]: number };
}

interface Difficulty {
    easy: Easy;
    hard: Easy;
    impossible: Easy;
    normal: Easy;
}

interface Easy {
    aiming: { [key: string]: number };
    boss: BossClass;
    change: { [key: string]: number };
    core: Core;
    cover: Cover;
    grenade: Grenade;
    hearing: Hearing;
    lay: Lay;
    look: Look;
    mind: Mind;
    move: Move;
    patrol: Patrol;
    scattering: { [key: string]: number };
    shoot: { [key: string]: number };
}

interface BossClass {
    bossDistToShoot: number;
    bossDistToShootSqrt: number;
    bossDistToWarning: number;
    bossDistToWarningOut: number;
    bossDistToWarningOutSqrt: number;
    bossDistToWarningSqrt: number;
    chanceToSendGrenade100: number;
    chanceUseReservePatrol100: number;
    coverToSend: boolean;
    deltaSearchTime: number;
    killaAfterGrenadeSuppressDelay: number;
    killaBulletToReload: number;
    killaCloseattackDelay: number;
    killaCloseattackTimes: number;
    killaCloseAttackDist: number;
    killaContutionTime: number;
    killaDefDistSqrt: number;
    killaDistToGoToSuppress: number;
    killaDitanceToBeEnemyBoss: number;
    killaEnemiesToAttack: number;
    killaHoldDelay: number;
    killaLargeAttackDist: number;
    killaMiddleAttackDist: number;
    killaOneIsClose: number;
    killaSearchMeters: number;
    killaSearchSECStopAfterComing: number;
    killaStartSearchSEC: number;
    killaTriggerDownDelay: number;
    killaWaitInCoverCoef: number;
    killaYDeltaToBeEnemyBoss: number;
    kojaniyDistEnemyTooClose: number;
    kojaniyDistToBeEnemy: number;
    kojaniyDistWhenReady: number;
    kojaniyManyEnemiesCoef: number;
    kojaniyMinDistToLoot: number;
    kojaniyMinDistToLootSqrt: number;
    maxDistCoverBoss: number;
    maxDistCoverBossSqrt: number;
    maxDistDeciderToSend: number;
    maxDistDeciderToSendSqrt: number;
    personsSend: number;
    shallWarn: boolean;
    timeAfterLose: number;
    timeAfterLoseDelta: number;
    waitNoAttackSavage: number;
}

interface Core {
    accuratySpeed: number;
    aimingType: string;
    canGrenade: boolean;
    canRun: boolean;
    damageCoeff: number;
    gainSightCoef: number;
    hearingSense: number;
    pistolFireDistancePref: number;
    rifleFireDistancePref: number;
    scatteringClosePerMeter: number;
    scatteringPerMeter: number;
    shotgunFireDistancePref: number;
    visibleAngle: number;
    visibleDistance: number;
    waitInCoverBetweenShotsSEC: number;
}

interface Cover {
    changeRunToCoverSEC: number;
    changeRunToCoverSECGreande: number;
    checkCoverEnemyLook: boolean;
    closeDistPointSqrt: number;
    deltaSeenFromCoveLastPos: number;
    dependsYDistToBot: boolean;
    distCantChangeWay: number;
    distCantChangeWaySqr: number;
    distCheckSfety: number;
    dogFightAfterLeave: number;
    enemyDistToGoOut: number;
    goodDistToPointCoef: number;
    hideToCoverTime: number;
    hitsToLeaveCover: number;
    hitsToLeaveCoverUnknown: number;
    lookLastEnemyPosLookaround: number;
    lookLastEnemyPosMoving: number;
    lookToHitPointIfLastEnemy: number;
    maxDistOfCover: number;
    maxDistOfCoverSqr: number;
    maxSpottedTimeSEC: number;
    minDefenceLevel: number;
    minDistToEnemy: number;
    moveToCoverWhenTarget: boolean;
    notLookAtWallIsDanger: boolean;
    offsetLookAlongWallAng: number;
    returnToAttackAfterAmbushMax: number;
    returnToAttackAfterAmbushMin: number;
    runCoverIfCanAndNoEnemies: boolean;
    runIfFar: number;
    runIfFarSqrt: number;
    shootNearSECPeriod: number;
    shootNearToLeave: number;
    soundToGetSpotted: number;
    spottedCoversRadius: number;
    spottedGrenadeRadius: number;
    spottedGrenadeTime: number;
    stayIfFar: number;
    stayIfFarSqrt: number;
    timeCheckSafe: number;
    timeToMoveToCover: number;
    waitIntCoverFindingEnemy: number;
}

interface Grenade {
    addGrenadeAsDanger: number;
    addGrenadeAsDangerSqr: number;
    ambushIfSmokeInZone100: number;
    ambushIfSmokeReturnToAttackSEC: number;
    angType: number;
    bewareType: number;
    beAttentionCoef: number;
    canThrowStraightContact: boolean;
    chanceRunFlashed100: number;
    chanceToNotifyEnemyGr100: number;
    cheatStartGrenadePlace: boolean;
    closeToSmokeTimeDelta: number;
    closeToSmokeToShoot: number;
    closeToSmokeToShootSqrt: number;
    damageGrenadeSuppressDelta: number;
    deltaGrenadeStartTime: number;
    deltaNextAttempt: number;
    deltaNextAttemptFromCover: number;
    flashGrenadeTimeCoef: number;
    grenadePerMeter: number;
    grenadePrecision: number;
    maxFlashedDistToShoot: number;
    maxFlashedDistToShootSqrt: number;
    maxThrowPower: number;
    minDistNotToThrow: number;
    minDistNotToThrowSqr: number;
    minThrowDistPercent0_1: number;
    minThrowGrenadeDist: number;
    minThrowGrenadeDistSqrt: number;
    nearDeltaThrowTimeSEC: number;
    noRunFromAIGrenades: boolean;
    requestDistMustThrow: number;
    requestDistMustThrowSqrt: number;
    runAway: number;
    runAwaySqr: number;
    shootToSmokeChance100: number;
    sizeSpottedCoef: number;
    smokeCheckDelta: number;
    smokeSuppressDelta: number;
    stopWhenThrowGrenade: boolean;
    straightContactDeltaSEC: number;
    stunSuppressDelta: number;
    timeShootToFlash: number;
    waitTimeTurnAway: number;
}

interface Hearing {
    botClosePanicDist: number;
    chanceToHearSimpleSound0_1: number;
    closeDist: number;
    deadBodySoundRAD: number;
    dispersionCoef: number;
    distPlaceToFindPoint: number;
    farDist: number;
    hearDelayWhenHaveSMT: number;
    hearDelayWhenPeace: number;
    lookOnlyDanger: boolean;
    lookOnlyDangerDelta: number;
    resetTimerDist: number;
    soundDirDeefree: number;
}

interface Lay {
    attackLayChance: number;
    checkShootWhenLaying: boolean;
    clearPointsOfScareSEC: number;
    damageTimeToGetup: number;
    deltaAfterGetup: number;
    deltaGetup: number;
    deltaLayCheck: number;
    deltaWantLayCheclSEC: number;
    distEnemyCanLay: number;
    distEnemyCanLaySqrt: number;
    distEnemyGetupLay: number;
    distEnemyGetupLaySqrt: number;
    distEnemyNullDangerLay: number;
    distEnemyNullDangerLaySqrt: number;
    distGrassTerrainSqrt: number;
    distToCoverToLay: number;
    distToCoverToLaySqrt: number;
    layAim: number;
    layChanceDanger: number;
    maxCanLayDist: number;
    maxCanLayDistSqrt: number;
    maxLayTime: number;
    minCanLayDist: number;
    minCanLayDistSqrt: number;
}

interface Look {
    bodyDeltaTimeSearchSEC: number;
    canLookToWall: boolean;
    comeToBodyDist: number;
    closeDeltaTimeSEC: number;
    distCheckWall: number;
    distNotToIgnoreWall: number;
    enemyLightAdd: number;
    enemyLightStartDist: number;
    farDistance: number;
    farDeltaTimeSEC: number;
    goalToFullDissapear: number;
    goalToFullDissapearShoot: number;
    lookAroundDelta: number;
    lookLastPosenemyIfNoDangerSEC: number;
    lightOnVisionDistance: number;
    marksmanVisibleDistCoef: number;
    maxVisionGrassMeters: number;
    maxVisionGrassMetersFlare: number;
    maxVisionGrassMetersFlareOpt: number;
    maxVisionGrassMetersOpt: number;
    middleDist: number;
    minLookAroudTime: number;
    middleDeltaTimeSEC: number;
    oldTimePoint: number;
    optimizeToOnlyBody: boolean;
    posibleVisionSpace: number;
    visibleDisnaceWithLight: number;
    waitNewSensor: number;
    waitNewLookSensor: number;
}

interface Mind {
    aiPowerCoef: number;
    ambushWhenUnderFire: boolean;
    ambushWhenUnderFireTimeResist: number;
    attackEnemyIfProtectDeltaLastTimeSeen: number;
    attackImmediatlyChance0_100: number;
    bulletFeelCloseSdist: number;
    bulletFeelDist: number;
    canPanicIsProtect: boolean;
    canReceivePlayerRequestsBear: boolean;
    canReceivePlayerRequestsSavage: boolean;
    canReceivePlayerRequestsUsec: boolean;
    canStandBy: boolean;
    canTakeItems: boolean;
    canThrowRequests: boolean;
    canUseMeds: boolean;
    chanceFuckYouOnContact100: number;
    chanceShootWhenWarnPlayer100: number;
    chanceToRunCauseDamage0_100: number;
    chanceToStayWhenWarnPlayer100: number;
    coverDistCoef: number;
    coverSecondsAfterLoseVision: number;
    coverSelfAlwaysIfDamaged: boolean;
    damageReductionTimeSEC: number;
    dangerPointChooseCoef: number;
    defaultBearBehaviour: string;
    defaultEnemyBear: boolean;
    defaultEnemyUsec: boolean;
    defaultSavageBehaviour: string;
    defaultUsecBehaviour: string;
    distToEnemyYoCanHeal: number;
    distToFoundSqrt: number;
    distToStopRunEnemy: number;
    dogFightIn: number;
    dogFightOut: number;
    enemyBotTypes: any[];
    enemyLookAtMeAng: number;
    findCoverToGetPositionWithShoot: number;
    friendlyBotTypes: any[];
    friendAgrKill: number;
    friendDeadAgrLow: number;
    groupAnyPhraseDelay: number;
    groupExactlyPhraseDelay: number;
    healDelaySEC: number;
    hitDelayWhenHaveSMT: number;
    hitDelayWhenPeace: number;
    hitPointDetection: number;
    holdIfProtectDeltaLastTimeSeen: number;
    lastseenPointChooseCoef: number;
    lastEnemyLookTo: number;
    maxAggroBotDist: number;
    maxAggroBotDistSqr: number;
    maxShootsTime: number;
    maxStartAggresionCoef: number;
    minDamageScare: number;
    minShootsTime: number;
    minStartAggresionCoef: number;
    noRunAwayForSafe: boolean;
    partPercentToHeal: number;
    pistolShotgunAmbushDist: number;
    protectDeltaHealSEC: number;
    protectTimeReal: boolean;
    secToMoreDistToRun: number;
    shootInsteadDogFight: number;
    simplePointChooseCoef: number;
    standartAmbushDist: number;
    suspetionPointChanceAdd100: number;
    talkWithQuery: boolean;
    timeToFindEnemy: number;
    timeToForgorAboutEnemySEC: number;
    timeToRunToCoverCauseShootSEC: number;
    warnBotTypes: string[];
}

interface Move {
    basestartSlowDist: number;
    baseRotateSpeed: number;
    baseSqrtStartSerach: number;
    baseStartSerach: number;
    chanceToRunIfNoAmmo0_100: number;
    deltaLastSeenEnemy: number;
    distToCanChangeWay: number;
    distToCanChangeWaySqr: number;
    distToStartRaycast: number;
    distToStartRaycastSqr: number;
    farDist: number;
    farDistSqr: number;
    reachDist: number;
    reachDistCover: number;
    reachDistRun: number;
    runIfCantShoot: boolean;
    runIfGaolFarThen: number;
    runToCoverMin: number;
    secToChangeToRun: number;
    slowCoef: number;
    startSlowDist: number;
    updateTimeRecalWay: number;
    yApproximation: number;
}

interface Patrol {
    canCheckMagazine: boolean;
    canChooseReserv: boolean;
    chanceToChangeWay0_100: number;
    chanceToCutWay0_100: number;
    chanceToShootDeadbody: number;
    changeWayTime: number;
    closeToSelectReservWay: number;
    cutWayMax0_1: number;
    cutWayMin0_1: number;
    friendSearchSEC: number;
    lookTimeBase: number;
    maxYdistToStartWarnRequestToRequester: number;
    minDistToCloseTalk: number;
    minDistToCloseTalkSqr: number;
    minTalkDelay: number;
    reserveOutTime: number;
    reserveTimeStay: number;
    suspetionPlaceLifetime: number;
    talkDelay: number;
    talkDelayBig: number;
    tryChooseReservWayOnStart: boolean;
    usePatrolPointActionMoveByReserveWay: boolean;
    visionDistCoefPeace: number;
}

interface Experience {
    aggressorBonus: number;
    level: Level;
    reward: Level;
    standingForKill: number;
}

interface Level {
    max: number;
    min: number;
}

interface Generation {
    items: GenerationItems;
}

interface GenerationItems {
    grenades: Level;
    healing: Level;
    drugs: Level;
    stims: Level;
    looseLoot: Level;
    magazines: Level;
    specialItems: Level;
}

interface Health {
    bodyParts: BodyPart[];
    energy: Level;
    hydration: Level;
    temperature: Level;
}

interface BodyPart {
    chest: Level;
    head: Level;
    leftArm: Level;
    leftLeg: Level;
    rightArm: Level;
    rightLeg: Level;
    stomach: Level;
}

interface Inventory {
    equipment: Equipment;
    items: InventoryItems;
    mods: Mods;
}

interface Equipment {
    armBand: Common;
    armorVest: Common;
    backpack: Common;
    earpiece: Common;
    eyewear: { [key: string]: number };
    faceCover: FaceCover;
    firstPrimaryWeapon: { [key: string]: number };
    headwear: { [key: string]: number };
    holster: { [key: string]: number };
    pockets: Pockets;
    scabbard: Common;
    secondPrimaryWeapon: Common;
    securedContainer: SecuredContainer;
    tacticalVest: Common;
}

interface Common {}

interface FaceCover {
    the5Bd073A586F7747E6F135799: number;
}

interface Pockets {
    the5Af99E9186F7747C447120B8: number;
}

interface SecuredContainer {
    the5C0A794586F77461C458F892: number;
}

interface InventoryItems {
    backpack: string[];
    pockets: string[];
    securedContainer: string[];
    specialLoot: any[];
    tacticalVest: any[];
}

interface Mods {
    the5648B4534Bdc2D3D1C8B4580: The5648_B4534Bdc2D3D1C8B4580;
    the571A29Dc2459771Fb2755A6A: The571_A29Dc2459771Fb2755A6A;
    the576165642459773C7A400233: The576165642459773C7A400233;
    the57616A9E2459773C7A400234: The571_A29Dc2459771Fb2755A6A;
    the57C69Dd424597774C03B7Bbc: The57_C69Dd424597774C03B7Bbc;
    the57Cffd8224597763B03Fc609: The57Cffd8224597763B03Fc609;
    the58272B392459774B4C7B3Ccd: The5648_B4534Bdc2D3D1C8B4580;
    the5926Bb2186F7744B1C6C6E60: The5926Bb2186F7744B1C6C6E60;
    the5926C0Df86F77462F647F764: The5926C0Df86F77462F647F764;
    the5926C3B286F774640D189B6B: The571_A29Dc2459771Fb2755A6A;
    the59C6633186F7740Cf0493Bb9: The59_;
    the59D64Ec286F774171D1E0A42: The59_;
    the5A3501Acc4A282000D72293A: The571_A29Dc2459771Fb2755A6A;
    the5A351711C4A282000B1521A4: The571_A29Dc2459771Fb2755A6A;
    the5Ac66C5D5Acfc4001718D314: The571_A29Dc2459771Fb2755A6A;
    the5Ac66Cb05Acfc40198510A10: The5_Ac66;
    the5Ac66D015Acfc400180Ae6E4: The5_Ac66;
    the5Ac78Eaf5Acfc4001926317A: The5Ac78Eaf5Acfc4001926317A;
    the5B3B713C5Acfc4330140Bd8D: The5B3B713C5Acfc4330140Bd8D;
    the5C0000C00Db834001A6697Fc: The5_C0000C00Db834001A6697Fc;
    the5C0548Ae0Db834001966A3C2: The571_A29Dc2459771Fb2755A6A;
    the5D010D1Cd7Ad1A59283B1Ce7: The5D010D1Cd7Ad1A59283B1Ce7;
    the5D1F819086F7744B355C219B: The5_C0000C00Db834001A6697Fc;
    the5D2C76Ed48F03532F2136169: The57_C69Dd424597774C03B7Bbc;
    the5Dcbd56Fdbd3D91B3E5468D5: The5Dcbd56Fdbd3D91B3E5468D5;
    the5Dcbe9431E1F4616D354987E: The5_C0000C00Db834001A6697Fc;
    the5Df8F541C41B2312Ea3335E3: The571_A29Dc2459771Fb2755A6A;
    the602286Df23506E50807090C6: The571_A29Dc2459771Fb2755A6A;
    the60228924961B8D75Ee233C32: The60228924961_B8D75Ee233C32;
    the602A9740Da11D6478D5A06Dc: The602A9740Da11D6478D5A06Dc;
    the6193A720F8Ee7E52E42109Ed: The6193A720F8Ee7E52E42109Ed;
    the6193D3149Fb0C665D5490E32: The571_A29Dc2459771Fb2755A6A;
    the6194F5A318A3974E5E7421Eb: The60228924961_B8D75Ee233C32;
}

interface The5648_B4534Bdc2D3D1C8B4580 {
    modForegrip: string[];
}

interface The571_A29Dc2459771Fb2755A6A {
    cartridges: string[];
}

interface The576165642459773C7A400233 {
    modCharge: string[];
    modHandguard: string[];
    modMagazine: string[];
    modMuzzle: string[];
    modPistolGrip: string[];
    modReciever: string[];
    modStock: string[];
    patronInWeapon: string[];
}

interface The57_C69Dd424597774C03B7Bbc {
    modScope: string[];
}

interface The57Cffd8224597763B03Fc609 {
    modMount003: string[];
}

interface The5926Bb2186F7744B1C6C6E60 {
    modCharge: string[];
    modMagazine: string[];
    modReciever: string[];
    patronInWeapon: string[];
}

interface The5926C0Df86F77462F647F764 {
    modHandguard: string[];
    modMuzzle: string[];
    modSightRear: string[];
    modStock: string[];
}

interface The59_ {
    modHandguard: string[];
}

interface The5_Ac66 {
    modGasBlock: string[];
    modMagazine: string[];
    modMuzzle: string[];
    modPistolGrip: string[];
    modReciever: string[];
    modStock: string[];
    modCharge?: string[];
}

interface The5Ac78Eaf5Acfc4001926317A {
    modStock: string[];
}

interface The5B3B713C5Acfc4330140Bd8D {
    modBarrel: string[];
    modMagazine: string[];
    modPistolGrip: string[];
}

interface The5_C0000C00Db834001A6697Fc {
    modMuzzle: string[];
}

interface The5D010D1Cd7Ad1A59283B1Ce7 {
    modForegrip: string[];
    modTactical003: string[];
}

interface The5Dcbd56Fdbd3D91B3E5468D5 {
    modBarrel: string[];
    modHandguard: string[];
    modMagazine: string[];
    modPistolGrip: string[];
    modScope: string[];
    patronInWeapon: string[];
}

interface The60228924961_B8D75Ee233C32 {
    modSightFront: string[];
    modSightRear: string[];
}

interface The602A9740Da11D6478D5A06Dc {
    modBarrel: string[];
    modMagazine: string[];
    modReciever: string[];
}

interface The6193A720F8Ee7E52E42109Ed {
    modBarrel: string[];
    modCatch: string[];
    modHammer: string[];
    modMagazine: string[];
    modMount000: string[];
    modReciever: string[];
    modTrigger: string[];
}

interface Skills {
    common: Common;
}
