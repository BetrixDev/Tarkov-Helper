import { capitalizeWords } from '../../lib'
import { fetchData } from '../cache'

enum BossToMap {
    'gluhar' = 'reserve',
    'killa' = 'interchange',
    'reshala' = 'customs',
    'sanitar' = 'shoreline',
    'shturman' = 'woods',
    'tagilla' = 'factory'
}

enum BosstoGame {
    'gluhar' = 'bossGluhar',
    'killa' = 'bossKilla',
    'reshala' = 'bossBully',
    'sanitar' = 'bossSanitar',
    'shturman' = 'bossKojaniy',
    'tagilla' = 'bossTagilla'
}

interface Limb {
    name: string
    hp: number
}

export class Boss {
    name: string
    map: string
    spawnChance: number = 0
    hitpoints: Limb[]
    followersAmount: number = 0

    constructor(name: BossName, language: Languages) {
        const bossData = fetchData<RawBoss>(name)

        const mapData = fetchData<RawMapData>(BossToMap[name])
        const mapLocales = fetchData<Locales>(language).locations[mapData._Id]

        this.name = capitalizeWords(name)
        this.map = mapLocales.Name
        this.hitpoints = Object.entries(bossData.health.BodyParts[0]).map(([name, { max }]) => {
            return { name: name, hp: max }
        })

        mapData.BossLocationSpawn.filter((s) => s.BossName === BosstoGame[name]).forEach((s) => {
            this.spawnChance = s.BossChance
            if (s.BossEscortAmount === '0' && s.Supports) {
                s.Supports.forEach((support) => (this.followersAmount += Number(support.BossEscortAmount)))
            } else {
                this.followersAmount += Number(s.BossEscortAmount)
            }
        })
    }
}
