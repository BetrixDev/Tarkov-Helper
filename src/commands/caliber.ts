import 'reflect-metadata'
import { Discord, Slash, SlashOption } from 'discordx'
import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from 'discord.js'
import { Cache, ErrorReponse } from '../lib'
import settings from '../data/settings'
import SearchEngine from '../helpers/search_engines/caliber-engine'
import { GetCalibers } from '../helpers/caliber-grabber'

@Discord()
export class CaliberCommand {
    @Slash('caliber', { description: 'Retrieve damage and penetration values of all bullets in a caliber' })
    price(
        @SlashOption('caliber', {
            description: 'Which caliber to use (start typing to search)',
            required: true,
            autocomplete: (interaction: AutocompleteInteraction) => {
                const input = interaction.options.getFocused(true)

                const results = SearchEngine(input.value.toString())

                interaction.respond(
                    results.map((result) => {
                        return { name: result.item.name, value: result.item.key }
                    })
                )
            },
            type: 'STRING'
        })
        caliber: string,
        interaction: CommandInteraction
    ) {
        try {
            if (GetCalibers()[caliber.replace('Caliber', '')] === undefined) {
                interaction.reply(
                    ErrorReponse('Please use the auto complete function to complete your search', 'caliber')
                )
                return
            }

            interaction.reply(this.message(caliber))
        } catch {
            interaction.reply(ErrorReponse('There was an unknown error executing this command', 'caliber'))
        }
    }

    message(caliber: string) {
        const bulletData = Cache.bulletData

        let bullets: { [key: string]: Bullet } = {}

        for (const id in bulletData) {
            const bullet = bulletData[id]

            if (bullet.caliber === caliber) bullets[id] = bullet
        }

        const bulletValues = Object.values(bullets)
            .map((bullet) => {
                return {
                    penetration: bullet.ballistics.penetrationPower,
                    damage: bullet.ballistics.damage,
                    name: bullet.shortName
                }
            })
            .sort((a, b) => {
                return b.penetration - a.penetration
            })

        return {
            embeds: [
                new MessageEmbed()
                    .setTitle(`${caliber.replace('Caliber', '')} Information`)
                    .setColor(settings.botSettings.color)
                    .setThumbnail(
                        'https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/ui_icons/icon_ammo.png'
                    )
                    .setFields([
                        {
                            name: 'Name',
                            value: bulletValues.map((b) => b.name).join('\n'),
                            inline: true
                        },
                        {
                            name: 'Penetration',
                            value: bulletValues.map((b) => b.penetration).join('\n'),
                            inline: true
                        },
                        {
                            name: 'Damage',
                            value: bulletValues.map((b) => b.damage).join('\n'),
                            inline: true
                        }
                    ])
            ]
        }
    }
}
