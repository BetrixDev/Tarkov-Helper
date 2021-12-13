import { CommandInteraction, InteractionReplyOptions, MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import settings from '../botConfig'
import { AppendCache } from '../helpers/Cache'
import { ResolveStrings } from './Strings'

type SearchData = {
    command: string
    variable: string
    args: {}
    interaction: CommandInteraction
}

export function ItemSearchMessage(args: { [key: string]: any }, results: any[], data: SearchData) {
    const date = Date.now()
    AppendCache(date.toString(), data)

    return {
        embeds: [
            new MessageEmbed()
                .setTitle('Complete Your Search')
                .setThumbnail(settings.images.thumbnails.search)
                .setColor(settings.botSettings.altColor).setDescription(`
                    Item search of **${args[data?.variable ?? 'item']}** came back with multiple results.
                    [Click here](${settings.itemArrayLink}) to see a list of all possible entries.
                    Use the dropdown menu below to specify your item
                `)
        ],
        components: [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`searchmenu__${date}`)
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder(`Choose an item to complete the search`)
                    .addOptions(
                        results.map((entry) => {
                            return {
                                label: entry.name,
                                value: entry.id
                            }
                        })
                    )
            )
        ],
        ephemeral: true
    }
}

export function QuestSearchMessage({ quest }: { quest: string }, results: any[]) {
    return {
        embeds: [
            new MessageEmbed()
                .setTitle('Complete Your Search')
                .setThumbnail(settings.images.thumbnails.search)
                .setColor(settings.botSettings.altColor).setDescription(`
                    Quest search of **${quest}** came back with multiple results.
                    Use the dropdown menu below to specify your item
                `)
        ],
        components: [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`searchmenu__${Date.now()}__${quest}`)
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder(`Choose a quest to complete the search`)
                    .addOptions(
                        results.map((entry) => {
                            return {
                                label: entry.title,
                                value: String(entry.id).toString()
                            }
                        })
                    )
            )
        ],
        ephemeral: true
    }
}

export function ErrorReponse(message: string, command: string): InteractionReplyOptions {
    return {
        embeds: [
            new MessageEmbed()
                .setAuthor('Tarkov Helper')
                .setColor(settings.botSettings.errorColor)
                .setTitle('The command issued had and error')
                .setDescription(`\`${message}\``)
                .setFooter(`Command issued: ${command}`)
        ]
    }
}

export function ErrorMessage(message: string, footer?: string): MessageEmbed {
    return new MessageEmbed()
        .setColor(settings.botSettings.errorColor)
        .setTitle('Error!')
        .setDescription(message)
        .setFooter(footer || '')
}

export function ErrorMessageField(message: string, fields: any[], footer?: string): MessageEmbed {
    return new MessageEmbed()
        .setColor(settings.botSettings.errorColor)
        .setTitle('Error!')
        .setDescription(message)
        .addFields(ResolveStrings([fields]))
        .setFooter(footer || '')
}
