import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { AutocompleteInteraction, CommandInteraction, MessageAttachment } from 'discord.js'
import { Cache, ErrorReponse, GetItem, isID, ResolveStrings, Round, THEmbed } from '../lib'
import SearchEngine from '../helpers/search_engines/item-engine'
import { BallisticsCalculator } from '../helpers/simulator/ballistics'

@Discord()
export class PenChanceCommand {
    @Slash('penchance', {
        description: 'Calculates the chance for a bullet to penetrate a piece of armor'
    })
    async quest(
        @SlashOption('bullet', {
            description: 'Bullet to simulate with',
            required: true,
            autocomplete: (interaction: AutocompleteInteraction) => {
                const input = interaction.options.getFocused(true)

                const results = SearchEngine(input.value.toString(), { types: ['ammo'], excludedTypes: ['grenade'] })

                interaction.respond(
                    results.map((result) => {
                        return { name: result.item.name, value: result.item.id }
                    })
                )
            },
            type: 'STRING'
        })
        bullet: string,
        @SlashOption('armor', {
            description: 'Can be a helmet, body armor or armored rig',
            required: true,
            autocomplete: (interaction: AutocompleteInteraction) => {
                const input = interaction.options.getFocused(true)

                const results = SearchEngine(input.value.toString(), {
                    types: ['armor', 'helmet']
                })

                interaction.respond(
                    results.map((result) => {
                        return { name: result.item.name, value: result.item.id }
                    })
                )
            },
            type: 'STRING'
        })
        armor: string,
        interaction: CommandInteraction
    ) {
        try {
            if (!isID(bullet) || !isID(armor)) {
                interaction.reply(
                    ErrorReponse('Please use the auto complete function to complete your search', interaction)
                )
                return
            }

            interaction.reply(await this.message(bullet, armor))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    async message(bulletID: string, armorID: string) {
        const bullet = GetItem(bulletID)
        const armor = GetItem(armorID)

        const ballisticData = new BallisticsCalculator(armorID, bulletID)
        const simResults = ballisticData.Simulate()
        const chart = await Chart(ballisticData.DurabilityPenchanceData, bullet, armor)

        return {
            embeds: [
                new THEmbed()
                    .setTitle(`Penetration Calculator`)
                    .setImage('attachment://chart.png')
                    .setColor(Cache.config.botSettings.color)
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
