import { AutocompleteInteraction, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Client, Discord, Slash, SlashOption } from 'discordx'
import 'reflect-metadata'
import { fetchData } from '../data/cache'
import { Item } from '../data/classes/item'
import { getCalibers } from '../helpers/caliber-grabber'
import { autoCompleteResults } from '../helpers/search_engines/caliber-engine'
import { handleCommandInteraction, THEmbed, translation } from '../lib'
import { RawAmmo } from '../types/game/ammo'
import { ErrorMessages } from './hideout'
import { table as tableConstructor } from 'table'

const getBulletDamage = (bullet: RawAmmo): string => {
    if (bullet.projectileCount > 1) {
        return `${bullet.projectileCount * bullet.ballistics.damage} (${bullet.ballistics.damage}x${
            bullet.projectileCount
        })`
    } else {
        return bullet.ballistics.damage.toString()
    }
}

@Discord()
export class CaliberCommand {
    @Slash('caliber', { description: 'Retrieve damage and penetration values of all bullets in a caliber' })
    caliber(
        @SlashOption('caliber', {
            description: 'Which caliber to use (start typing to search)',
            autocomplete: async (interaction: AutocompleteInteraction) => await autoCompleteResults(interaction),
            type: 'STRING'
        })
        caliber: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                if (getCalibers()[caliber.replace('Caliber', '')] === undefined) {
                    error(translation(Language)(ErrorMessages.USE_AUTO_COMPLETE))
                } else {
                    respond(CaliberCommand.message(caliber, Language))
                }
            })
        )
    }

    static message(caliber: string, language: Languages): InteractionReplyOptions {
        const t = translation(language)

        const bulletData = fetchData<Record<string, RawAmmo>>('ammoData')

        let bullets: Record<string, RawAmmo> = {}

        Object.entries(bulletData).forEach(([id, v]) => {
            if (v.caliber === caliber) {
                bullets[id] = v
            }
        })

        const tableData: [string, string, string, string][] = [
            [t('Name'), t('Penetration'), t('Damage'), t('Velocity (m/s)')]
        ]

        Object.values(bullets)
            .sort((a, b) => {
                return b.ballistics.penetrationPower - a.ballistics.penetrationPower
            })
            .forEach((bullet) => {
                const { id, ballistics } = bullet

                tableData.push([
                    Item.getLocales(id, language).shortName,
                    ballistics.penetrationPower.toString(),
                    getBulletDamage(bullet),
                    ballistics.initialSpeed.toString()
                ])
            })

        const table = tableConstructor(tableData)

        return {
            embeds: [
                new THEmbed()
                    .setTitle(t('Caliber data for {0}', caliber.replace('Caliber', '')))
                    .setDescription(`\`\`\`\n${table}\n\`\`\``)
            ]
        }
    }
}
