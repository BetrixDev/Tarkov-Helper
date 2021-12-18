import 'reflect-metadata'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { BossImage, ReadJson, ResolveStrings } from '../../Lib'
import settings from '../../data/bot/settings'

@Discord()
export abstract class Command {
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
            required: true
        })
        boss: string
    ) {}
}

export default async (interaction: CommandInteraction, args: { boss: keyof typeof BossNames }) => {
    return new Promise<InteractionReplyOptions>(async (respond, error) => {
        // Grab the boss' data
        const boss = new Boss(args.boss)

        // Format and send the message
        respond({
            embeds: [
                new MessageEmbed()
                    .setColor(settings.botSettings.color)
                    .setTitle(`${boss.name} Information`)
                    .setThumbnail(BossImage(args.boss))
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
        })

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}

/*
    Data for command
*/

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

    /* publics */
    name: string
    map: string

    constructor(name: keyof typeof BossNames) {
        this.gameName = name
        this.bossData = ReadJson(`./src/data/game/database/bots/types/${name}.json`)
        this.mapData = ReadJson(`./src/data/game/database/locations/${BossNames[name].rawMap}/base.json`)

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
        const bossHealth: { [key: string]: { min: number; max: number } } = this.bossData.health.BodyParts

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
                    escorts.push(`**${type.BossEscortAmount}** ${type.BossEscortType.replace('follower' + this.gameName.replace('boss', ''), '')}`)
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
