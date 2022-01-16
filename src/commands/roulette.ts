import 'reflect-metadata'
import { ButtonComponent, Discord, Slash } from 'discordx'
import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from 'discord.js'
import { Cache, ErrorReponse, FormatPrice, GetDBItem, GetItemByType, Random, ResolveStrings, THEmbed } from '../lib'
import { container, injectable } from 'tsyringe'
import { RouletteResults } from '../database/roulette-results'

export type Result = {
    map: string
    gun: Item
    armor: Item
    helmet: Item
}

@Discord()
@injectable()
export class RouletteCommand {
    constructor(private _database: RouletteResults) {}

    @Slash('roulette', {
        description: 'Strat Roulette for Escape from Tarkov'
    })
    dogtag(interaction: CommandInteraction) {
        try {
            interaction.reply(this.message())
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    @ButtonComponent(/^reroll__/)
    async reroll(interaction: ButtonInteraction) {
        const [_, type, date] = interaction.customId.split('__')

        const db = container.resolve(RouletteCommand)._database
        const data = db.query(Number(date))

        if (!data) {
            await interaction.deferUpdate()
            return
        }

        const preset: { [key: string]: any } = new Randomizer().Results

        if (type === 'all') {
            interaction.update(this.message(preset))
        } else {
            let mixedResults: { [key: string]: any } = data
            mixedResults[type] = preset[type]

            interaction.update(this.message(mixedResults))
        }
    }

    message(data?: any) {
        const results = new Randomizer()

        if (data) if (data) results.Preset(data)

        const { map, helmet, armor, gun } = results.Results

        const kitCost = helmet.lastLowPrice + armor.lastLowPrice + gun.lastLowPrice

        const date = Date.now()
        const db = container.resolve(RouletteCommand)._database
        db.add(date, results.Results)

        return {
            embeds: [
                new THEmbed()
                    .setThumbnail(Cache.config.images.thumbnails.roulette)
                    .setTitle('Tarkov Roulette')
                    .addFields(
                        ResolveStrings([
                            {
                                name: 'Map',
                                value: map
                            },
                            {
                                name: 'Helmet',
                                value: `[${helmet.shortName}](${helmet.wikiLink}) *(Class ${
                                    GetDBItem(helmet.id)?.raw?.armorClass ?? 'Unknown'
                                })*`
                            },
                            {
                                name: 'Body Armor',
                                value: `[${armor.shortName}](${armor.wikiLink}) *(Class ${
                                    GetDBItem(armor.id)?.raw?.armorClass ?? 'Unknown'
                                })*`
                            },
                            {
                                name: 'Gun',
                                value: `[${gun.shortName}](${gun.wikiLink})`
                            },
                            {
                                name: 'Raw cost',
                                value: `${FormatPrice(kitCost)} *(only flea prices)*`
                            }
                        ])
                    )
                    .setFooter('To reroll different fields, click the buttons below')
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton().setCustomId(`reroll__map__${date}`).setLabel('Map').setStyle('PRIMARY'),
                    new MessageButton().setCustomId(`reroll__helmet__${date}`).setLabel('Helmet').setStyle('PRIMARY'),
                    new MessageButton().setCustomId(`reroll__all__${date}`).setLabel('All').setStyle('PRIMARY')
                ]),
                new MessageActionRow().addComponents([
                    new MessageButton().setCustomId(`reroll__armor__${date}`).setLabel('Armor').setStyle('PRIMARY'),
                    new MessageButton().setCustomId(`reroll__gun__${date}`).setLabel('Gun').setStyle('PRIMARY'),
                    new MessageButton().setCustomId(`blank`).setLabel('\u200b').setStyle('SECONDARY').setDisabled(true)
                ])
            ]
        }
    }
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
