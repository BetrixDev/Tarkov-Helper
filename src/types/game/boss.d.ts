export type BossName = 'gluhar' | 'killa' | 'reshala' | 'sanitar' | 'shturman' | 'tagilla'

export interface RawBoss {
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

export interface Core {
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
