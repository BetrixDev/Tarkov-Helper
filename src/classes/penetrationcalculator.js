// https://www.desmos.com/calculator/m8cmsfokkl
require('../utils')

let GameData = ReadJson('./src/game_data/api/itemdata.json')

class PenetrationCalculator {
    constructor(armorID, bulletID) {
        let bulletData = GameData[bulletID].RawData._props
        let armorData = GameData[armorID].RawData._props

        this.armorClass = armorData.armorClass
        this.armorDurability = armorData.MaxDurability

        this.bulletPenetration = bulletData.PenetrationPower
        this.bulletArmorDamage = bulletData.ArmorDamage
    }
    CalculateChance(currentDurability) {
        let penetrationChance

        let d = (currentDurability / this.armorDurability) * 100
        let c = this.armorClass
        let n = this.bulletPenetration

        let a = (121 - 5000 / (45 + d * 2)) * c * 10 * 0.01

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
}

exports.PenetrationCalculator = PenetrationCalculator