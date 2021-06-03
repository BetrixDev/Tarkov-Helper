let fs = require('fs')

let BossDir = fs.readdirSync('./src/game_data/bosses').filter(file => !file.endsWith('.json'))

function GetBosses() {
    let Bosses = new Array()

    for (const Boss of BossDir) {
        Bosses.push({
            name: Boss,
            value: Boss
        })
    }

    return Bosses
}

exports.GetBosses = GetBosses