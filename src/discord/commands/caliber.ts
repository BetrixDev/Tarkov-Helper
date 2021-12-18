import 'reflect-metadata'

import { CommandInteraction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { SetServerData } from '../../helpers/Database'
import { Cache, ReadJson } from '../../Lib'
import settings from '../../data/bot/settings'

/* Class for dealing with registering command */

@Discord()
export abstract class Command {
    @Slash('caliber', {
        description: 'Retrieve damage and penetration values of all bullets in a caliber'
    })
    caliber(
        @SlashChoice(GetCalibers())
        @SlashOption('caliber', {
            description: 'Which caliber to use',
            required: true
        })
        caliber: string
    ) {}
}

/* Message for command */

export default async (interaction: CommandInteraction, { caliber }: { caliber: string }) => {
    return new Promise<InteractionReplyOptions>(async (resolve, error) => {
        const bulletData = Cache.bulletData

        let bullets: { [key: string]: Bullet } = {}

        for (const id in bulletData) {
            const bullet = bulletData[id]

            if (bullet.caliber === caliber) bullets[id] = bullet
        }

        const bulletValues = Object.values(bullets)
            .map((bullet) => {
                return { penetration: bullet.ballistics.penetrationPower, damage: bullet.ballistics.damage, name: bullet.shortName }
            })
            .sort((a, b) => {
                return b.penetration - a.penetration
            })

        resolve({
            embeds: [
                new MessageEmbed()
                    .setTitle(`${caliber.replace('Caliber', '')} Information`)
                    .setColor(settings.botSettings.color)
                    .setThumbnail('https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/ui_icons/icon_ammo.png')
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
        })

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}

function GetCalibers() {
    const bulletData = Cache.bulletData
    let calibers: { [key: string]: string } = {}

    for (const id in bulletData) {
        const bullet = bulletData[id]

        calibers[bullet.caliber.replace('Caliber', '')] = bullet.caliber
    }

    return calibers
}
