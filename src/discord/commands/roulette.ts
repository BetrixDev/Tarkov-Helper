import 'reflect-metadata'
import { Discord, Slash } from 'discordx'
import { CommandInteraction, Interaction, InteractionReplyOptions, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { FormatPrice, GetDBItem, GetItem, GetItemByType, Random, ResolveStrings } from '../../Lib'
import settings from '../../botConfig'
import { AppendCache } from '../../helpers/Cache'

/*
    Class for dealing with registering command
*/

@Discord()
export class Command {
    @Slash('roulette', {
        description: 'Strat Roulette for Escape from Tarkov'
    })
    roulette(interaction: CommandInteraction) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: any, extras?: { preset?: Result }) => {
    const results = new Randomizer()

    if (extras) if (extras.preset) results.Preset(extras.preset)

    const { map } = results.Results

    const helmet = results.Results.helmet
    const armor = results.Results.armor
    const gun = results.Results.gun

    const date = Date.now().toString()
    AppendCache(date, { interaction, results: results.Results })

    const kitCost = helmet.lastLowPrice + armor.lastLowPrice + gun.lastLowPrice

    return {
        embeds: [
            new MessageEmbed()
                .setThumbnail(settings.images.thumbnails.roulette)
                .setColor(settings.botSettings.color)
                .setTitle('Tarkov Roulette')
                .addFields(
                    ResolveStrings([
                        {
                            name: 'Map',
                            value: map
                        },
                        {
                            name: 'Helmet',
                            value: `[${helmet.shortName}](${helmet.wikiLink}) *(Class ${GetDBItem(helmet.id).raw.armorClass})*`
                        },
                        {
                            name: 'Body Armor',
                            value: `[${armor.shortName}](${armor.wikiLink}) *(Class ${GetDBItem(armor.id).raw.armorClass})*`
                        },
                        {
                            name: 'Gun',
                            value: `[${gun.shortName}](${gun.wikiLink})`
                        },
                        {
                            name: 'Raw cost',
                            value: FormatPrice(kitCost)
                        }
                    ])
                )
                .setFooter('To reroll different fields, click the buttons below')
        ],
        components: [
            new MessageActionRow().addComponents([
                new MessageButton().setCustomId(`reroll__${date}__map`).setLabel('Map').setStyle('PRIMARY'),
                new MessageButton().setCustomId(`reroll__${date}__helmet`).setLabel('Helmet').setStyle('PRIMARY'),
                new MessageButton().setCustomId(`reroll__${date}__all`).setLabel('All').setStyle('PRIMARY')
            ]),
            new MessageActionRow().addComponents([
                new MessageButton().setCustomId(`reroll__${date}__armor`).setLabel('Armor').setStyle('PRIMARY'),
                new MessageButton().setCustomId(`reroll__${date}__gun`).setLabel('Gun').setStyle('PRIMARY'),
                new MessageButton().setCustomId(`blank__${date}`).setLabel('\u200b').setStyle('SECONDARY').setDisabled(true)
            ])
        ]
    }
}

/*
    Data for command
*/

export type Result = {
    map: string
    gun: Item
    armor: Item
    helmet: Item
}

export class Randomizer {
    private map: string
    private gun: Item
    private armor: Item
    private helmet: Item

    constructor() {
        const maps = ['Customs', 'Factory', 'Interchange', 'Reserve', 'Shoreline', 'Labs', 'Woods', 'Lighthouse']
        const helmets = GetItemByType('helmet')
        const armors = GetItemByType('armor')
        const guns = GetItemByType('gun')

        this.map = maps[Random(0, maps.length)]
        this.helmet = helmets[Random(0, helmets.length)]
        this.armor = armors[Random(0, armors.length)]
        this.gun = guns[Random(0, guns.length)]
    }

    Preset(preset: Result) {
        this.map = preset.map
        this.helmet = preset.helmet
        this.gun = preset.gun
        this.armor = preset.armor
    }

    get Results(): Result {
        return {
            gun: this.gun,
            armor: this.armor,
            helmet: this.helmet,
            map: this.map
        }
    }
}
