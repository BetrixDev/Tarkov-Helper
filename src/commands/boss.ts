import { CommandInteraction } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { BossImage, Cache, ErrorReponse, ReadJson, ResolveStrings, THEmbed } from '../lib'

@Discord()
export abstract class BossCommand {
    @Slash('boss', {
        description: 'Returns information on the specified boss'
    })
    async boss(
        @SlashChoice('Gluhkar', 'bossgluhar')
        @SlashChoice('Killa', 'bosskilla')
        @SlashChoice('Reshala', 'bossbully')
        @SlashChoice('Sanitar', 'bosssanitar')
        @SlashChoice('Shturman', 'bosskojaniy')
        @SlashChoice('Tagilla', 'bosstagilla')
        @SlashOption('boss', {
            description: 'Boss to get info of',
            required: true,
            type: 'STRING'
        })
        boss: keyof typeof BossNames,
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.message(boss))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message(bossId: keyof typeof BossNames) {
        const boss = new Boss(bossId)

        return {
            embeds: [
                new THEmbed()
                    .setColor(Cache.config.botSettings.color)
                    .setTitle(`${boss.name} Information`)
                    .setThumbnail(BossImage(bossId))
                    .addFields(
                        ResolveStrings([
                            {
                                name: 'Spawns on',
                                value: boss.map,
                                inline: true
                            },
                            {
                                name: 'Spawn Chance',
                                value: `${boss.spawnChance}%`,
                                inline: true
                            },
                            {
                                name: 'Spawn Locations',
                                value: boss.spawnLocations,
                                inline: true
                            },
                            {
                                name: 'Health',
                                value: boss.health,
                                inline: true
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true
                            },
                            {
                                name: 'Followers',
                                value: boss.followers,
                                inline: true
                            },
                            {
                                name: 'Attributes',
                                value: boss.attributes,
                                inline: true
                            }
                        ])
                    )
            ]
        }
    }
}

const BossNames = {
    bossgluhar: { name: 'Gluhkar', rawMap: 'rezervbase', map: 'Reserve' },
    bosskilla: { name: 'Killa', rawMap: 'interchange', map: 'Interchange' },
    bossbully: { name: 'Reshala', rawMap: 'bigmap', map: 'Customs' },
    bosssanitar: { name: 'Sanitar', rawMap: 'shoreline', map: 'Shoreline' },
    bosskojaniy: { name: 'Shturman', rawMap: 'woods', map: 'Woods' },
    bosstagilla: { name: 'Tagilla', rawMap: 'factory4_day', map: 'Factory' }
}

class Boss {
    private bossData: { [key: string]: any }
    private mapData: { [key: string]: any }
    private gameName: string
    private bossSpawnData:
        | {
              Supports?: { BossEscortType: string; BossEscortDifficult: string[]; BossEscortAmount: string }[]
              BossName: string
              BossChance: number
              BossZone: string
              BossEscortAmount: string
              BossEscortType: string
          }
        | undefined

    name: string
    map: string

    constructor(name: keyof typeof BossNames) {
        this.gameName = name
        this.bossData = ReadJson(`./game_data/database/bots/types/${name}.json`)
        this.mapData = ReadJson(`./game_data/database/locations/${BossNames[name].rawMap}/base.json`)

        const spawnData = this.mapData.BossLocationSpawn as typeof this.bossSpawnData[]
        this.bossSpawnData = spawnData.find((data) => {
            return data?.BossName.toLowerCase() == name
        })

        this.name = BossNames[name].name
        this.map = BossNames[name].map
    }

    get spawnChance() {
        if (this.bossSpawnData) {
            return this.bossSpawnData.BossChance
        } else {
            return 0
        }
    }

    get health() {
        const bossHealth: { [key: string]: { min: number; max: number } } = this.bossData.health.BodyParts[0]

        let health: string[] = []
        let total = 0

        for (const limbName in bossHealth) {
            const limb = bossHealth[limbName]

            total += limb.max

            if (limbName === 'Head' || limbName === 'Chest') {
                health.push(`${limbName}: **${limb.max}**hp`)
            }
        }

        return [`**Total: ${total}**hp`, ...health]
    }

    get spawnLocations() {
        if (this.bossSpawnData) {
            // Location1,Location2,Location3
            return this.bossSpawnData.BossZone.split(',').length
        } else {
            return 'None'
        }
    }

    get attributes() {
        const bossStats: { VisibleAngle: number; VisibleDistance: number } = this.bossData.difficulty.normal.Core

        return [`FOV: ${bossStats.VisibleAngle}°`, `View Distance: ${bossStats.VisibleDistance}m`]
    }

    get followers() {
        const spawnData = this.bossSpawnData

        let escorts: string[] = []

        if (spawnData) {
            const followerName = spawnData.BossEscortType.replace('follower', '')

            if (spawnData.Supports) {
                spawnData.Supports.forEach((type) => {
                    escorts.push(
                        `**${type.BossEscortAmount}** ${type.BossEscortType.replace(
                            'follower' + this.gameName.replace('boss', ''),
                            ''
                        )}`
                    )
                })
            } else {
                if (spawnData.BossEscortAmount != '0') {
                    if (this.gameName.includes(followerName)) {
                        escorts.push(`**${spawnData.BossEscortAmount}** Guards`)
                    } else {
                        escorts.push(`**${spawnData.BossEscortAmount}** ${followerName}`)
                    }
                }
            }
        }

        if (escorts.length == 0) {
            escorts = ['None']
        }

        return escorts
    }
}
