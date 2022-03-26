import { capitalizeWords } from '../../Lib'
import { Core, RawBoss } from '../../types/game/Boss'
import { Locales } from '../../types/game/Locales'
import { BossLocationSpawn, RawMapData } from '../../types/game/Location'
import { fetchData } from '../Cache'

type Attributes = {
    [key in keyof Core]?: (value: any) => string
}
const ATTRIBUTES: Attributes = {
    VisibleAngle: (value: number) => `FOV: ${value}°`,
    VisibleDistance: (value: number) => `View Distance: ${value}m`
}

export enum BossToMap {
    'bossGluhar' = 'reserve',
    'bossKilla' = 'interchange',
    'bossBully' = 'customs',
    'bossSanitar' = 'shoreline',
    'bossKojaniy' = 'woods',
    'bossTagilla' = 'factory'
}

enum BosstoName {
    'bossGluhar' = 'gluhar',
    'bossKilla' = 'killa',
    'bossBully' = 'reshala',
    'bossSanitar' = 'sanitar',
    'bossKojaniy' = 'shturman',
    'bossTagilla' = 'tagilla'
}

interface Limb {
    name: string
    hp: number
}

export class Boss {
    name: string
    map: string
    spawnChance: number
    hitpoints: Limb[]
    followersAmount: number = 0
    spawnLocations: number

    private bossData: RawBoss

    constructor(id: keyof typeof BossToMap, language: Languages) {
        const bossData = fetchData<RawBoss>(BosstoName[id])
        this.bossData = bossData

        const mapData = fetchData<RawMapData>(BossToMap[id])
        const mapLocales = fetchData<Locales>(language).locations[mapData._Id]

        this.name = capitalizeWords(BosstoName[id])
        this.map = mapLocales.Name
        this.hitpoints = Object.entries(bossData.health.BodyParts[0]).map(([name, { max }]) => {
            return { name: name, hp: max }
        })

        const mapBossData = mapData.BossLocationSpawn.find((s) => s.BossName === id) as BossLocationSpawn

        this.spawnChance = mapBossData.BossChance

        if (mapBossData.BossEscortAmount === '0' && mapBossData.Supports) {
            mapBossData.Supports.forEach((support) => {
                this.followersAmount += Number(support.BossEscortAmount)
            })
        } else {
            this.followersAmount += Number(mapBossData.BossEscortAmount)
        }

        // Spawn zones are comma separated in the files
        this.spawnLocations = mapBossData.BossZone.split(',').length
    }

    get health() {
        let totalHp = 0

        this.hitpoints.forEach(({ hp }) => {
            totalHp += hp
        })

        return {
            total: totalHp,
            head: this.hitpoints.find(({ name }) => name === 'Head') as Limb,
            thorax: this.hitpoints.find(({ name }) => name === 'Chest') as Limb
        }
    }

    get attributes(): string[] {
        const attributes = this.bossData.difficulty.normal.Core

        type Key = keyof Core
        return Object.entries(attributes)
            .filter(([key]) => ATTRIBUTES[key as Key] !== undefined)
            .map(([key, value]) => {
                const func = ATTRIBUTES[key as Key] as (value: any) => string

                return func(value)
            })
    }
}
