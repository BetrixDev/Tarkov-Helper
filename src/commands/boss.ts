import 'reflect-metadata'
import { CommandInteraction } from 'discord.js'
import { Client, Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { Boss, BossToMap } from '../data/classes/Boss'
import { DATABASE_LOCATION, handleCommandInteraction, THEmbed, translation } from '../Lib'

enum Bosses {
    Gluhkar = 'bossGluhar',
    Killa = 'bossKilla',
    Reshala = 'bossBully',
    Sanitar = 'bossSanitar',
    Shturman = 'bossKojaniy',
    Tagilla = 'bossTagilla'
}

@Discord()
export abstract class BossCommand {
    @Slash('boss', {
        description: 'Returns information on the specified boss'
    })
    async boss(
        @SlashChoice(Bosses)
        @SlashOption('boss', {
            description: 'Boss to get info of',
            type: 'STRING'
        })
        bossName: keyof typeof BossToMap,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                const t = translation(Language)

                const boss = new Boss(bossName, Language)

                respond({
                    embeds: [
                        new THEmbed()
                            .setTitle(`${boss.name} Information`)
                            .setThumbnail(`${DATABASE_LOCATION}/images/boss_images/${bossName}.png`)
                            .addFields(
                                {
                                    name: t('Spawns on'),
                                    value: boss.map,
                                    inline: true
                                },
                                {
                                    name: t('Spawn Chance'),
                                    value: `${boss.spawnChance}%`,
                                    inline: true
                                },
                                {
                                    name: 'Spawn Locations',
                                    value: boss.spawnLocations.toString(),
                                    inline: true
                                },
                                {
                                    name: t('Health'),
                                    value: [
                                        t(`**Total: {0}hp**`, boss.health.total),
                                        t(`Head: **{0}**hp`, boss.health.head.hp),
                                        t(`Thorax: **{0}**hp`, boss.health.thorax.hp)
                                    ].join('\n'),
                                    inline: true
                                },
                                {
                                    name: '\u200b',
                                    value: '\u200b',
                                    inline: true
                                },
                                {
                                    name: t('Followers'),
                                    value: boss.followersAmount > 0 ? boss.followersAmount.toString() : t('None'),
                                    inline: true
                                },
                                {
                                    name: t('Attributes'),
                                    value: boss.attributes.join('\n'),
                                    inline: true
                                }
                            )
                    ]
                })
            })
        )
    }
}
