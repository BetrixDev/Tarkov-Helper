let fs = require('fs')

class BossInfo {
    constructor(Boss) {
        this.Name = Boss
        this.Map = require('../game_data/bosses/maps.json')[Boss]
        this.SpawnChance = GetMapData(this.Map).BossChance
        this.SpawnPoints = GetMapData(this.Map).BossZone.split(',')
    }
    Health() {
        let HealthData = ReadFile(this.Name, 'health')

        let Health = new Array()

        let TotalHealth = 0
        for (const LimbName in HealthData.BodyParts) {
            let LimbData = HealthData.BodyParts[LimbName]

            TotalHealth = TotalHealth + Number(LimbData.max)

            if (LimbName === "Head" || LimbName === "Chest") {
                Health.push(`${LimbName}: **${LimbData.max}**hp`)
            }
        }

        Health = [`**Total: ${TotalHealth}**hp`, ...Health]

        return Health
    }
    Followers() {
        let BossData = GetMapData(this.Map)

        let BossName = this.Name.replace('k', '') // Fix for gluhkar's name always being spelt different

        let Escorts = new Array()

        if (BossData.BossEscortAmount === "0") { return [`**No Followers**`] } // When a boss doesn't have followers

        let Total = 0
        if (BossData.Supports === undefined) { // If boss only has 1 type of follower
            let FollowerName = BossData.BossEscortType.replace('follower', '')

            if (BossData.BossName.includes(FollowerName)) { // Fix for when follower type is the same name as the boss
                Escorts.push(`**${BossData.BossEscortAmount}** Guards`)
            } else {
                Escorts.push(`**${BossData.BossEscortAmount}** ${FollowerName}`)
            }

            Total = Number(BossData.BossEscortAmount)

        } else { // If boss only has multiple types of followers
            for (const Type of BossData.Supports) {
                Escorts.push(`**${Type.BossEscortAmount}** ${Type.BossEscortType.replace('follower' + BossName, '')}`)
                Total = Total + Number(Type.BossEscortAmount)
            }
        }

        Escorts = [`**Total: ${Total}**`, ...Escorts]

        return Escorts
    }
    Attributes() {
        let BossData = ReadFile(this.Name, 'normal', true)['Core']

        let Attributes = new Array()

        Attributes.push(`FOV: ${BossData.VisibleAngle}°`)
        Attributes.push(`View Distance: ${BossData.VisibleDistance}m`)

        return Attributes
    }
}

function GetMapData(Map) {
    let BossData = require(`../game_data/maps/${Map.toLowerCase()}`).base.BossLocationSpawn[0]

    if (BossData.BossName === 'sectantPriest') { // For maps that have cultists
        BossData = require(`../game_data/maps/${Map.toLowerCase()}`).base.BossLocationSpawn[1]
    }

    return BossData
}

function ReadFile(Boss, File, Nested = false) {
    if (Nested) {
        return JSON.parse(fs.readFileSync(`./src/game_data/bosses/${Boss}/difficulty/${File}.json`))
    } else {
        return JSON.parse(fs.readFileSync(`./src/game_data/bosses/${Boss}/${File}.json`))
    }
}


exports.BossInfo = BossInfo