const fs = require('fs')
const ItemData = JSON.parse(fs.readFileSync('./src/game_data/api/itemdata.json'))

function GetCalibers() {
    let CaliberData = {}
    let Calibers = new Array()

    for (const i in ItemData) {
        let Item = ItemData[i]

        if (Item.Types.includes('ammo') && !Item.Types.includes('grenade') && !Item.Name.includes('pcs.')) {
            let Caliber = Item.Name.split(' ')[0].replace('mm', '') // Gives better result then using 'RawData.Caliber'

            if (CaliberData[Caliber] === undefined) {
                Calibers.push({
                    name: Caliber,
                    value: Caliber
                })
            }

            let RawData = Item.RawData.Data

            CaliberData[Caliber] = {
                Name: Item.ShortName,
                ID: Item.ID,
                Damage: RawData.Damage,
                ArmorDamage: RawData.ArmorDamage,
                Penetration: RawData.PenetrationPower
            }
        }
    }

    return { Calibers: Calibers, CaliberData: CaliberData }
}

exports.GetCalibers = GetCalibers