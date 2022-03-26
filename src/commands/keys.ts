import 'reflect-metadata'
import {
    CommandInteraction,
    EmbedFieldData,
    InteractionReplyOptions,
    MessageActionRow,
    MessageSelectMenu,
    MessageSelectOptionData,
    SelectMenuInteraction
} from 'discord.js'
import { Client, Discord, SelectMenuComponent, Slash, SlashChoice, SlashOption } from 'discordx'
import { fetchData } from '../data/Cache'
import { Item } from '../data/classes/Item'
import { Location } from '../data/classes/Location'
import { DATABASE_LOCATION, formatPrice, handleCommandInteraction, THEmbed, translation } from '../Lib'
import { Maps } from '../types/Maps'

const mapUrlPrefix = `${DATABASE_LOCATION}/images/map_icons`

export interface Key {
    name: string
    shortName: string
    normalizedName: string
    id: string
    wikiLink: string
}

type WikiMap = 'The_Lab' | 'Interchange' | 'Woods' | 'Customs' | 'Factory' | 'Reserve' | 'Shoreline' | 'Lighthouse'

const WikiMaptoMap: { [key in WikiMap]: string } = {
    Customs: 'customs',
    Factory: 'factory',
    Interchange: 'interchange',
    Lighthouse: 'lighthouse',
    Reserve: 'reserve',
    Shoreline: 'shoreline',
    The_Lab: 'labs',
    Woods: 'woods'
}

@Discord()
export abstract class KeysCommand {
    @Slash('keys', {
        description: 'Returns all keys on a specified map and what loot is behind them'
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
            description: 'What location to use'
        })
        map: WikiMap,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise((respond, error) => {
                respond(KeysCommand.baseMessage(Language, map))
            })
        )
    }

    @SelectMenuComponent(/^keys__/)
    async menuInteraction(interaction: SelectMenuInteraction) {
        const [_, map, page, language] = interaction.customId.split('__')
        const selected = interaction.values[0]

        if (selected === 'BACK') {
            interaction.update(KeysCommand.baseMessage(language as Languages, map as WikiMap, Number(page) - 1))
        } else if (selected === 'FORWARD') {
            interaction.update(KeysCommand.baseMessage(language as Languages, map as WikiMap, Number(page) + 1))
        } else {
            interaction.update(KeysCommand.keyMessage(selected, map, language as Languages, Number(page)))
        }
    }

    static baseMessage(language: Languages, map: WikiMap, page = 0): InteractionReplyOptions {
        const rawMap = WikiMaptoMap[map] as Maps
        const location = new Location(rawMap, language)

        const t = translation(language)

        return {
            embeds: [
                new THEmbed()
                    .setTitle(`${location.name} Keys`)
                    .setThumbnail(`${mapUrlPrefix}/${rawMap}.png`)
                    .setDescription(
                        `${location.description}\n\n${t('Use the menu below to view what loots the keys have')}`
                    )
            ],
            components: [new MessageActionRow().addComponents(KeysCommand.menu(map, page, language))]
        }
    }

    static keyMessage(id: string, map: string, language: Languages, page: number): InteractionReplyOptions {
        const t = translation(language)

        const key = new Item(id, language)

        const fields: EmbedFieldData =
            key.keyData && key.keyData.length > 0
                ? { name: t('Behind the Lock'), value: key.keyData.join('\n') }
                : { name: t('No Data'), value: '\u200b' }

        return {
            embeds: [
                new THEmbed()
                    .setTitle(t(`{0} Loot`, key.shortName))
                    .addFields(fields)
                    .setFooter({ text: t('To view a different key, use the menu below') })
                    .setThumbnail(key.iconURL)
            ],
            components: [
                new MessageActionRow().addComponents(
                    KeysCommand.menu(map as WikiMap, page, language, t(`Selected: {0}`, key.shortName))
                )
            ]
        }
    }

    private static menu(map: WikiMap, page: number, language: Languages, placeholder = 'Select a Key') {
        const t = translation(language)

        const keyMapData = fetchData<{ [key: string]: Key[] }>('mapKeys')

        const data = keyMapData[map]
        const pages = Math.ceil(data.length / 20)

        let options: MessageSelectOptionData[] = data
            // Sort keys highest price to lowest price
            .sort((a, b) => {
                const aData = new Item(a.id, language)
                const bData = new Item(b.id, language)

                return bData.priceData.avg24hPrice - aData.priceData.avg24hPrice
            })
            .map(({ id }) => {
                const item = new Item(id, language)
                return { label: `${item.shortName} - ${formatPrice(item.priceData.avg24hPrice)}`, value: item.id }
            })
            .slice(page * 20, page * 20 + 20)

        if (page > 1) {
            options.unshift({ label: t('... Previous keys'), value: 'BACK' })
        }
        if (page < pages) {
            options.push({ label: t('... More keys'), value: 'FORWARD' })
        }

        const menu = new MessageSelectMenu()
            .addOptions(options)
            .setCustomId(`keys__${map}__${page}__${language}`)
            .setPlaceholder(placeholder)

        return menu
    }
}
