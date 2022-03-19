export interface RawAmmo {
    id: string
    name: string
    shortName: string
    weight?: number
    caliber: string
    stackMaxSize?: number
    tracer: boolean
    tracerColor: TracerColor
    ammoType: AmmoType
    projectileCount: number
    ballistics: Ballistics
}

export enum AmmoType {
    Buckshot = 'buckshot',
    Bullet = 'bullet',
    Grenade = 'grenade'
}

export interface Ballistics {
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

export enum TracerColor {
    Green = 'green',
    Red = 'red',
    TracerGreen = 'tracerGreen',
    TracerRed = 'tracerRed'
}
