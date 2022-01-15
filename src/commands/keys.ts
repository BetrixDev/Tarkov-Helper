import 'reflect-metadata'
import { Discord, SelectMenuComponent, Slash, SlashChoice, SlashOption } from 'discordx'
import {
    CommandInteraction,
    EmbedFieldData,
    InteractionReplyOptions,
    MessageActionRow,
    MessageEmbed,
    MessageSelectMenu,
    MessageSelectOptionData,
    SelectMenuInteraction
} from 'discord.js'
import { ErrorReponse, FormatPrice, GetDBItem, GetItem, ItemImage, ReadJson } from '../lib'
import settings from '../data/settings'
import { MapInfo } from './map'
import { MapNames } from '../../types/database/maps'

const mapUrlPrefix = 'https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/map_icons/'
type WikiMap = 'The_Lab' | 'Interchange' | 'Woods' | 'Customs' | 'Factory' | 'Reserve' | 'Shoreline' | 'Lighthouse'

const WikiMaptoMap = {
    The_Lab: 'thelab',
    Interchange: 'interchange',
    Woods: 'woods',
    Customs: 'customs',
    Factory: 'factory',
    Reserve: 'reserve',
    Shoreline: 'shoreline',
    Lighthouse: 'lighthouse'
}

@Discord()
export class PriceCommand {
    @Slash('keys', {
        description: 'Returns all keys on a specfied map and what loot is behind them'
    })
    async map(
        @SlashChoice('Lighthouse', 'Lighthouse')
        @SlashChoice('Labs', 'The_Lab')
        @SlashChoice('Interchange', 'Interchange')
        @SlashChoice('Woods', 'Woods')
        @SlashChoice('Customs', 'Customs')
        @SlashChoice('Factory', 'Factory')
        @SlashChoice('Reserve', 'Reserve')
        @SlashChoice('Shoreline', 'Shoreline')
        @SlashOption('map', {
            description: 'What location to use',
            required: true
        })
        map: WikiMap,
        interaction: CommandInteraction
    ) {
        try {
            interaction.reply(this.baseMessage(map))
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    @SelectMenuComponent(/^keys__/)
    async menuInteraction(interaction: SelectMenuInteraction) {
        const [_, map, page] = interaction.customId.split('__')
        const selected = interaction.values[0]

        if (selected === 'BACK') {
            interaction.update(this.baseMessage(map as WikiMap, Number(page) - 1))
        } else if (selected === 'FORWARD') {
            interaction.update(this.baseMessage(map as WikiMap, Number(page) + 1))
        } else {
            interaction.update(this.keyMessage(selected, map, Number(page)))
        }
    }

    baseMessage(map: WikiMap, page = 0): InteractionReplyOptions {
        const rawMap = WikiMaptoMap[map] as MapNames
        const mapData = new MapInfo(rawMap)

        return {
            embeds: [
                new MessageEmbed()
                    .setTitle(`${mapData.name} Keys`)
                    .setThumbnail(`${mapUrlPrefix}${rawMap}.png`)
                    .setDescription(
                        `
                    *"${mapData.Description}"*
                    
                    Use the menu below to view what loots the keys have
                    `
                    )
                    .setColor(settings.botSettings.color)
            ],
            components: [new MessageActionRow().addComponents(this.menu(map, page))]
        }
    }

    keyMessage(id: string, map: string, page: number): InteractionReplyOptions {
        const keyData = GetItem(id)
        let keyLootData = GetDBItem(id).key

        let fields: EmbedFieldData = {} as EmbedFieldData

        if (keyLootData && keyLootData.length > 0) {
            fields = { name: 'Behind the Lock', value: keyLootData.join('\n') }
        } else {
            fields = { name: 'No Data', value: '\u200b' }
        }

        return {
            embeds: [
                new MessageEmbed()
                    .setTitle(`${keyData.shortName} Loot`)
                    .addFields(fields)
                    .setFooter('To view a different key, use the menu below')
                    .setThumbnail(ItemImage(keyData.id))
                    .setColor(settings.botSettings.color)
            ],
            components: [
                new MessageActionRow().addComponents(this.menu(map as WikiMap, page, `Selected: ${keyData.shortName}`))
            ]
        }
    }

    menu(map: WikiMap, page: number, placeholder = 'Select a key') {
        const keyMapData = ReadJson<{ [key: string]: Key[] }>('game_data/mapkeys.json')

        const data = keyMapData[map]
        const pages = Math.ceil(data.length / 20)

        let options = data
            // Sort keys highest price to lowest price
            .sort((a, b) => {
                const aData = GetItem(a.id)
                const bData = GetItem(b.id)

                return bData.lastLowPrice - aData.lastLowPrice
            })
            .map((key) => {
                const item = GetItem(key.id)
                return { label: `${key.shortName} - ${FormatPrice(item.lastLowPrice)}`, value: key.id }
            })
            .slice(page * 20, page * 20 + 20)
        if (page > 1) options.unshift({ label: '... Previous keys', value: 'BACK' })
        if (page < pages) options.push({ label: '... More keys', value: 'FORWARD' })

        const menu = new MessageSelectMenu()
            .addOptions(options)
            .setCustomId(`keys__${map}__${page}`)
            .setPlaceholder(placeholder)

        return menu
    }
}
