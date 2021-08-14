require('../../utils')

let GameData = ReadJson('./src/game_data/api/itemdata.json')
let ArmorMaterials = ReadJson('./src/game_data/database/globals.json').config.ArmorMaterials
let ArmorResistance = ReadJson('./src/game_data/database/globals.json').config.armor.class

class PenetrationCalculator {
    constructor(armorID, bulletID) {
        let bulletData = GameData[bulletID].RawData._props
        let armorData = GameData[armorID].RawData._props

        this.armorClass = armorData.armorClass
        this.armorDurability = armorData.MaxDurability
        this.currentDurability = armorData.MaxDurability
        this.armorDestructibility = ArmorMaterials[armorData.ArmorMaterial].Destructibility
        this.armorResistance = 10 //ArmorResistance[this.armorClass].resistance

        this.bulletPenetration = bulletData.PenetrationPower
        this.bulletArmorDamage = bulletData.ArmorDamage
        this.bulletDamage = bulletData.Damage
    }
    CalculateChance() {
        let penetrationChance

        let d = (this.currentDurability / this.armorDurability) * 100
        let c = this.armorClass
        let n = this.bulletPenetration

        let a = (121 - 5000 / (45 + d * 2)) * c * this.armorResistance * 0.01

        if (n < a - 15) { // Bullet will not pen armor at its current durability
            penetrationChance = 0
        } else if (n < a) { // Bullet pen is less than class of armor * 10 (basically), so the pen chance would be under 90
            const line = (x) => {
                return ((4 / 10) * Math.pow(a - x - 15, 2)) / 100
            }
            penetrationChance = line(n) * 100
        } else { // Bullet pen is more than class of armor * 10, so the pen chance would be over 90
            const line = (x) => {
                return (100 + x / (.9 * a - x)) / 100
            }
            penetrationChance = line(n) * 100
        }

        return penetrationChance
    }
    DamageArmor(penetrated) {
        // Work in progress
        let bulletArmorDamage = this.bulletArmorDamage
        let bulletPenetration = this.bulletPenetration

        let armorDamage = 0

        if (this.currentDurability <= 0) {
            return
        }

        if (penetrated) {
            armorDamage = (bulletPenetration * bulletArmorDamage * ClampNumber((bulletPenetration / this.armorResistance), 0.5, 0.9) * this.armorDestructibility) / 100
        } else {
            armorDamage = (bulletPenetration * bulletArmorDamage * ClampNumber((bulletPenetration / this.armorResistance), 0.6, 1.1) * this.armorDestructibility) / 100
        }

        if (armorDamage < 1) {
            armorDamage = 1
        } else {
            armorDamage = Math.round(armorDamage * 100) / 100
        }

        this.currentDurability -= armorDamage
    }
}

function ClampNumber(num, min, max) {
    return Math.min(Math.max(num, min), max)
}

exports.PenetrationCalculator = PenetrationCalculator