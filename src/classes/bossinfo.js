let fs = require('fs')

const BossMaps = {
    "bossgluhar": "rezervbase",
    "bosskilla": "interchange",
    "bossbully": "bigmap",
    "bosssanitar": "shoreline",
    "bosskojaniy": "woods",
    "bosstagilla": "factory4_day"
}

class BossInfo {
    constructor(Boss) {
        this.Name = Boss
        this.Map = BossMaps[Boss]
        this.SpawnChance = GetMapData(this.Map).BossChance
        this.SpawnPoints = GetMapData(this.Map).BossZone.split(',')
        this.BossData = require(`../game_data/database/bots/types/${Boss}.json`)
    }
    Health() {
        let HealthData = this.BossData.health

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

        let BossName = BossData.BossName.replace('boss', '')

        let Escorts = new Array()

        if (BossData.BossEscortAmount === "0" && BossData.BossName !== 'bossGluhar') { return [`**No Followers**`] } // When a boss doesn't have followers

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
                console.log('follower' + BossName);
                Escorts.push(`**${Type.BossEscortAmount}** ${Type.BossEscortType.replace('follower' + BossName.replace('boss',''), '')}`)
                Total = Total + Number(Type.BossEscortAmount)
            }
        }

        Escorts = [`**Total: ${Total}**`, ...Escorts]

        return Escorts
    }
    Attributes() {
        let BossData = this.BossData.difficulty.normal['Core']

        let Attributes = new Array()

        Attributes.push(`FOV: ${BossData.VisibleAngle}°`)
        Attributes.push(`View Distance: ${BossData.VisibleDistance}m`)

        return Attributes
    }
}

function GetMapData(Map) {
    let BossData = require(`../game_data/database/locations/${Map}/base.json`).BossLocationSpawn[0]

    if (BossData.BossName === 'sectantPriest') { // For maps that have cultists
        BossData = require(`../game_data/database/locations/${Map}/base.json`).BossLocationSpawn[1]
    }

    return BossData
}

exports.BossInfo = BossInfo