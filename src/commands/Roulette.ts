import 'reflect-metadata'
import { ButtonComponent, Client, Discord, Slash } from 'discordx'
import {
    ButtonInteraction,
    CommandInteraction,
    InteractionReplyOptions,
    MessageActionRow,
    MessageButton
} from 'discord.js'
import { IRouletteData, RouletteData } from '../database/RouletteData'
import { formatPrice, handleCommandInteraction, random, THEmbed, translation } from '../Lib'
import { fetchData } from '../Cache'
import { TarkovToolsItem } from '../types/game/Item'
import { Item } from '../lib/game/Item'
import { injectable } from 'tsyringe'
import BotConfig from '../config/BotConfig'

type RouletteButtons = 'gun' | 'helmet' | 'armor' | 'map' | 'all'

@Discord()
@injectable()
export class RouletteCommand {
    constructor(private rouletteData: RouletteData) {}

    @ButtonComponent(/^roulette/)
    rouletteButton(interaction: ButtonInteraction) {
        const buttonAction = interaction.customId.split('__')[1] as RouletteButtons
        const language = interaction.customId.split('__')[2] as Languages

        // Treat 'all' as a new command and generate all from scratch
        if (buttonAction === 'all') {
            const rouletteData = this.generateRouletteData()

            interaction.update(this.getMessage(language, rouletteData))
            return
        }

        let rouletteData = this.rouletteData.fetchData(interaction.user.id)

        // Avoid random errors by creating an object is one doesn't exist (after bot restarts)
        if (!rouletteData) {
            rouletteData = this.generateRouletteData()
        }

        let newRouletteData: Partial<IRouletteData> = { ...rouletteData }
        delete newRouletteData[buttonAction]

        const generatedData = this.generateRouletteData(newRouletteData)
        this.rouletteData.setData(interaction.user.id, generatedData)
        interaction.update(this.getMessage(language, generatedData))
    }

    @Slash('roulette', {
        description: 'Strat Roulette for Escape from Tarkov'
    })
    roulette(interaction: CommandInteraction, client: Client, { serverData: { Language: language } }: GuardData) {
        handleCommandInteraction(
            interaction,
            language,
            new Promise((respond) => {
                const rouletteData = this.generateRouletteData()

                this.rouletteData.setData(interaction.user.id, rouletteData)

                respond(this.getMessage(language, rouletteData))
            })
        )
    }

    private getMessage(language: Languages, rouletteData: IRouletteData): InteractionReplyOptions {
        const t = translation(language)

        const gun = new Item(rouletteData.gun, language)
        const armor = new Item(rouletteData.armor, language)
        const helmet = new Item(rouletteData.helmet, language)

        const totalKitCost = [gun, armor, helmet]
            .map((item) => item.buyingPrice()?.priceRUB ?? 0)
            .reduce((cost, i) => cost + i, 0)

        const nonIncludedItems = [gun, armor, helmet]
            .filter((item) => !item.props.CanSellOnRagfair)
            .map((item) => item.shortName)

        return {
            embeds: [
                new THEmbed()
                    .setTitle(t('Tarkov Roulette'))
                    .setThumbnail(BotConfig.images.thumbnails.roulette)
                    .setFields(
                        {
                            name: t('Map'),
                            value: rouletteData.map
                        },
                        {
                            name: t('Helmet'),
                            value: `[${helmet.shortName}](${helmet.wikiLink}) (Class ${helmet.props.armorClass})`
                        },
                        {
                            name: t('Body Armor'),
                            value: `[${armor.shortName}](${armor.wikiLink}) (Class ${armor.props.armorClass})`
                        },
                        {
                            name: t('Gun'),
                            value: `[${gun.shortName}](${gun.wikiLink})`
                        },
                        {
                            name: t('Total Cost'),
                            // Very readable :)
                            value: `${formatPrice(totalKitCost)} ${
                                nonIncludedItems.length > 0
                                    ? `${t('*(Not Included: {0})*', nonIncludedItems.join(', '))}`
                                    : ''
                            }`
                        }
                    )
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton().setCustomId(`roulette__map__${language}`).setLabel('Map').setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId(`roulette__helmet__${language}`)
                        .setLabel('Helmet')
                        .setStyle('PRIMARY'),
                    new MessageButton().setCustomId(`roulette__all__${language}`).setLabel('All').setStyle('PRIMARY')
                ]),
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setCustomId(`roulette__armor__${language}`)
                        .setLabel('Armor')
                        .setStyle('PRIMARY'),
                    new MessageButton().setCustomId(`roulette__gun__${language}`).setLabel('Gun').setStyle('PRIMARY'),
                    new MessageButton().setCustomId(`blank`).setLabel('\u200b').setStyle('SECONDARY').setDisabled(true)
                ])
            ]
        }
    }

    private generateRouletteData(oldData: Partial<IRouletteData> = {}): IRouletteData {
        const data = fetchData<TarkovToolsItem[]>('itemData')

        const guns: TarkovToolsItem[] = []
        const armor: TarkovToolsItem[] = []
        const helmets: TarkovToolsItem[] = []
        const maps: string[] = [
            'Woods',
            'Shoreline',
            'Labs',
            'Factory',
            'Customs',
            'Reserve',
            'Lighthouse',
            'Interchange'
        ]

        data.forEach((item) => {
            if (item.types.includes('gun')) {
                guns.push(item)
            }

            // All helmets are armor, so we use this order to ensure correct items
            if (item.types.includes('helmet')) {
                helmets.push(item)
            } else if (item.types.includes('armor')) {
                armor.push(item)
            }
        })

        return {
            ...{
                gun: guns[random(0, guns.length)].id,
                armor: armor[random(0, armor.length)].id,
                helmet: helmets[random(0, helmets.length)].id,
                map: maps[random(0, maps.length)]
            },
            ...oldData
        }
    }
}
