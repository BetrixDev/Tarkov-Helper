type ItemType =
    | 'any'
    | 'ammo'
    | 'armor'
    | 'backpack'
    | 'barter'
    | 'glasses'
    | 'grenade'
    | 'gun'
    | 'helmet'
    | 'keys'
    | 'markedOnly'
    | 'mods'
    | 'noFlea'
    | 'provisions'
    | 'unLootable'
    | 'wearable'
    | 'rig'
    | 'headphones'
    | 'suppressor'
    | 'disabled'

type TraderNames =
    | 'prapor'
    | 'therapist'
    | 'fence'
    | 'skier'
    | 'peacekeeper'
    | 'mechanic'
    | 'ragman'
    | 'jaeger'
    | 'fleaMarket'

type RequirementType = 'playerLevel' | 'loyaltyLevel' | 'questCompleted'

interface Item {
    types: ItemType[]
    id: string
    name: string
    shortName: string
    avg24hPrice: number
    lastLowPrice: number
    changeLast48h: number
    width: number
    height: number
    wikiLink: string
    sellFor: ItemPrice[]
    buyFor: ItemPrice[]
}

interface ItemPrice {
    source: TraderNames
    price: number
    requirements: PriceRequirement[]
}

interface PriceRequirement {
    type: RequirementType
    value: number
}

interface Bullet {
    id: string
    name: string
    shortName: string
    weight: number
    caliber: string
    stackMaxSize: number
    tracer: boolean
    tracerColor: 'red' | 'green'
    ammoType: 'bullet' | 'buckshot' | 'grenade'
    projectileCount: number
    ballistics: {
        damage: number
        armorDamage: number
        fragmentationChance: number
        ricochetChance: number
        penetrationChance: number
        penetrationPower: number
        accuracy: number
        recoil: number
        initialSpeed: number
    }
}
