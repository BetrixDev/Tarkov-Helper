import { Clamp, GetDBItem, Random, ReadJson } from '../../lib'

let ArmorMaterials = ReadJson<any>('game_data/database/globals.json').config.ArmorMaterials

type Result = {
    chance: number
    durability: number
    penned: boolean
    rolled: number
}

type ArmorData = {
    class: number
    durability: number
    currentDurability: number
    destructibility: number
    resistance: number
}

type BulletData = {
    penetration: number
    armorDamage: number
    damage: number
}

export class BallisticsCalculator {
    armorData: ArmorData
    bulletData: BulletData

    constructor(armor: string, bullet: string) {
        const armorData = GetDBItem(armor).raw
        const bulletData = GetDBItem(bullet).raw

        this.armorData = {
            class: armorData.armorClass,
            durability: armorData.Durability,
            currentDurability: armorData.Durability,
            destructibility: ArmorMaterials[armorData.ArmorMaterial].Destructibility,
            resistance: 10
        }

        this.bulletData = {
            penetration: bulletData.PenetrationPower,
            armorDamage: bulletData.ArmorDamage,
            damage: bulletData.Damage
        }
    }
    get CurrentChance(): number {
        let penetrationChance: number

        const armorData = this.armorData
        const bulletData = this.bulletData

        const c = armorData.class
        const d = (armorData.currentDurability / armorData.durability) * 100
        const n = bulletData.penetration

        const a = (121 - 5000 / (45 + d * 2)) * c * armorData.resistance * 0.01

        if (n < a - 15) {
            penetrationChance = 0
        } else if (n < a) {
            const line = (x: number) => {
                return ((4 / 10) * Math.pow(a - x - 15, 2)) / 100
            }
            penetrationChance = line(n) * 100
        } else {
            const line = (x: number) => {
                return (100 + x / (0.9 * a - x)) / 100
            }
            penetrationChance = line(n) * 100
        }

        return penetrationChance
    }
    DamageArmor(penetrated: boolean) {
        let bulletArmorDamage = this.bulletData.armorDamage
        let bulletPenetration = this.bulletData.penetration

        let armorDamage = 0

        if (this.armorData.currentDurability <= 0) return

        if (penetrated) {
            armorDamage =
                (bulletPenetration *
                    bulletArmorDamage *
                    Clamp(bulletPenetration / this.armorData.resistance, 0.5, 0.9) *
                    this.armorData.destructibility) /
                100
        } else {
            armorDamage =
                (bulletPenetration *
                    bulletArmorDamage *
                    Clamp(bulletPenetration / this.armorData.resistance, 0.6, 1.1) *
                    this.armorData.destructibility) /
                100
        }

        if (armorDamage < 1) {
            armorDamage = 1
        } else {
            armorDamage = Math.round(armorDamage * 100) / 100
        }

        this.armorData.currentDurability -= armorDamage
    }
    get DurabilityPenchanceData() {
        let data: { durability: number; penChance: number }[] = new Array()

        const maxDurability = this.armorData.durability

        for (let i = 0; i < maxDurability; i++) {
            data.push({
                durability: this.armorData.currentDurability,
                penChance: this.CurrentChance
            })

            this.armorData.currentDurability--
        }

        return data
    }
    Simulate() {
        const iterations = 1000

        let simResults: Result[][] = new Array()

        for (let i = 0; i < iterations; i++) {
            let result: Result[] = new Array()

            while (this.armorData.currentDurability > 0) {
                if (this.armorData.currentDurability < 0) this.armorData.currentDurability = 0

                let penChance = this.CurrentChance

                let random = Random(1, 100)
                let penned = true

                if (penChance > random) {
                    this.DamageArmor(true)
                } else {
                    this.DamageArmor(false)
                    penned = false
                }

                if (this.armorData.currentDurability < 0) {
                    this.armorData.currentDurability = 0
                    penChance = 100
                }

                result.push({ chance: penChance, durability: this.armorData.currentDurability, penned, rolled: random })
            }

            simResults.push(result)

            this.armorData.currentDurability = this.armorData.durability
        }

        let report = {
            averageShotsToPen: 0,
            averageShotsToZero: 0
        }

        simResults.forEach((sim) => {
            report.averageShotsToZero += sim.length

            for (let i in sim) {
                let result = sim[i]
                if (result.penned) {
                    report.averageShotsToPen += Number(i)
                    break
                }
            }
        })

        report.averageShotsToZero = report.averageShotsToZero / simResults.length
        report.averageShotsToPen = report.averageShotsToPen / simResults.length

        return report
    }
}
