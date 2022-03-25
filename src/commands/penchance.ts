import 'reflect-metadata'
import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions, MessageAttachment } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import { injectable } from 'tsyringe'
import { itemIdFromString } from '../data/cache'
import { Item } from '../data/classes/item'
import { autoCompleteResults } from '../helpers/search_engines/item-engine'
import { BallisticsCalculator } from '../helpers/simulator/ballistics'
import { handleCommandInteraction, round, THEmbed, translation, TranslationFunction } from '../lib'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas'

export enum ErrorMessages {
    USE_AUTO_COMPLETE = 'Please use the auto complete function to complete your search'
}

@Discord()
@injectable()
export class PenChanceCommand {
    @Slash('penchance', { description: 'A penetration chance calculator' })
    async penChance(
        @SlashOption('bullet', {
            description: 'Bullet to simulate with',
            autocomplete: async (interaction: AutocompleteInteraction) =>
                await autoCompleteResults(interaction, { types: ['Ammo'] }),
            type: 'STRING'
        })
        bulletInput: string,
        @SlashOption('armor', {
            description: 'Can be a helmet, body armor or armored rig',
            autocomplete: async (interaction: AutocompleteInteraction) =>
                await autoCompleteResults(interaction, {
                    guard: (item) => {
                        return (
                            item.props.MaxDurability !== undefined &&
                            item.props.MaxDurability > 0 &&
                            item.props.armorClass !== undefined &&
                            item.props.armorClass > 0
                        )
                    }
                }),
            type: 'STRING'
        })
        armorInput: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise(async (respond, error) => {
                const t = translation(Language)

                // Make sure item ids are actual ids
                const bulletId = itemIdFromString(bulletInput)
                const armorId = itemIdFromString(armorInput)

                if (bulletId === undefined || armorId === undefined) {
                    error(t(ErrorMessages.USE_AUTO_COMPLETE))
                    return
                }

                const bullet = new Item(bulletId, Language)
                const armor = new Item(armorId, Language)
                const simulator = new BallisticsCalculator(armor, bullet)

                const simResults = simulator.simulate()
                const chart = await createChart(simulator.durabilityPenchanceData, bullet, armor, t)

                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(t('Penetration Calculator'))
                            .setImage('attachment://chart.png')
                            .addFields(
                                {
                                    name: t('Average Shots to Pen'),
                                    value: (Math.round(simResults.averageShotsToPen * 10000) / 10000).toString(),
                                    inline: true
                                },
                                {
                                    name: t('Average Shots to Zero'),
                                    value: (Math.round(simResults.averageShotsToZero * 10000) / 10000).toString(),
                                    inline: true
                                }
                            )
                    ],
                    files: [new MessageAttachment(chart, 'chart.png')]
                })
            })
        )
    }
}

interface Point {
    /**X coordinate*/
    durability: number
    /**Y coordinate*/
    penChance: number
}

export const createChart = async (
    data: Point[],
    bullet: Item,
    armor: Item,
    t: TranslationFunction
): Promise<Buffer> => {
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

    let labels = data.map((point) => {
        return point.durability % 5 > 0 ? '' : point.durability
    })
    let points = data.map((point) => {
        return round(point.penChance, '00')
    })

    return await chart.renderToBuffer({
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: t('Penetration Curve'),
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
                        text: t('Durability')
                    }
                },
                y: {
                    ticks: {
                        callback: (value: number | string) => value + '%'
                    },
                    title: {
                        display: true,
                        text: t('Chance')
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: t('{0} & {1} Pentration Chances', bullet.shortName, armor.shortName),
                    font: {
                        size: 30
                    }
                }
            }
        }
    })
}
