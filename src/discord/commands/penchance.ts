import 'reflect-metadata'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { CommandInteraction, InteractionReplyOptions, MessageAttachment, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import path from 'path'
import settings from '../../data/bot/settings'
import { Clamp, GetDBItem, GetItem, ItemSearchMessage, Random, ReadJson, ResolveStrings, Round, SearchEngine } from '../../Lib'

type Args = { bullet: string; armor: string }

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('penchance', {
        description: 'Calculates the chance for a bullet to penetrate a piece of armor'
    })
    async penchance(
        @SlashOption('bullet', {
            description: 'bullet to simulate with',
            required: true
        })
        bullet: string,
        @SlashOption('armor', {
            description: 'can be a helmet, body armor or armored rig',
            required: true
        })
        armor: string,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: Args): Promise<InteractionReplyOptions> => {
    const searchResults = [SearchEngine(args.bullet, { types: ['ammo'] }), SearchEngine(args.armor, { types: ['armor', 'helmet'] })]

    let items: any = new Array()

    for (let i in searchResults) {
        let item = searchResults[i]
        let results = item.results
        let field: keyof Args = Number(i) == 0 ? 'bullet' : 'armor'

        if (results.length > 1) {
            return ItemSearchMessage({ item: args[field] }, results, {
                command: 'penchance',
                variable: field,
                args,
                interaction
            })
        } else if (item.error) {
            return {
                embeds: [item.error],
                ephemeral: true
            }
        }

        items.push(GetItem(results[0].id))
    }

    const ballisticData = new BallisticsCalculator(items[1].id, items[0].id)
    const simResults = ballisticData.Simulate()
    const chart = await Chart(ballisticData.DurabilityPenchanceData, items[0], items[1])

    return {
        embeds: [
            new MessageEmbed()
                .setTitle(`Penetration Calculator`)
                .setImage('attachment://chart.png')
                .setColor(settings.botSettings.color)
                .addFields(
                    ResolveStrings([
                        {
                            name: 'Average Shots to Pen',
                            value: Math.round(simResults.averageShotsToPen * 10000) / 10000,
                            inline: true
                        },
                        {
                            name: 'Average Shots to Zero',
                            value: Math.round(simResults.averageShotsToZero * 10000) / 10000,
                            inline: true
                        }
                    ])
                )
        ],
        files: [new MessageAttachment(chart, 'chart.png')]
    }
}

/*
    Data for command
*/

let ArmorMaterials = ReadJson(path.join(__dirname, '..', '..', '..', 'game_data', 'database', 'globals.json')).config.ArmorMaterials

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

type Result = { chance: number; durability: number; penned: boolean; rolled: number }

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

type Point = {
    durability: number
    penChance: number
}

export async function Chart(data: any[], bullet: Item, armor: Item): Promise<Buffer> {
    const chart = new ChartJSNodeCanvas({
        width: 1600,
        height: 900,
        backgroundColour: '#15242e',
        chartCallback: (ChartJS) => {
            ChartJS.defaults.color = '#FFFFFF'
            ChartJS.defaults.font = {
                size: 24,
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                style: 'normal',
                weight: null,
                lineHeight: 1.2
            }
        }
    })

    let labels = data.map((point: Point) => {
        return point.durability % 5 > 0 ? '' : point.durability
    })
    let points = data.map((point: Point) => {
        return Round(point.penChance, '00')
    })

    return await chart.renderToBuffer({
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Penetration Curve',
                    data: points,
                    backgroundColor: 'rgba(21, 36, 46, 1)',
                    borderColor: 'rgba(221, 204, 76, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Durability'
                    }
                },
                y: {
                    ticks: {
                        callback: (value: number | string) => value + '%'
                    },
                    title: {
                        display: true,
                        text: 'Chance'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${bullet.shortName} & ${armor.shortName} Pentration Chances`,
                    font: {
                        size: 30
                    }
                }
            }
        }
    })
}
