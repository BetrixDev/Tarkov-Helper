const fs = require('fs')

const Items = require('../game_data/ammo.json')

const GetCalibers = () => {
    fs.writeFileSync('./game_data/calibers.json', JSON.stringify({}))
    let Calibers = new Array()
    for (const Item in Items) {
        if (Items[Item]._props.Caliber !== undefined) {
            let FormattedCaliber = Items[Item]._props.Caliber.replace('Caliber', '')
            if (Calibers.includes(FormattedCaliber) === false) {
                Calibers.push(FormattedCaliber)
            }
        }
    }
    fs.writeFileSync('./game_data/calibers.json', JSON.stringify(Calibers, null, 2))
}

exports.GetCalibers = GetCalibers