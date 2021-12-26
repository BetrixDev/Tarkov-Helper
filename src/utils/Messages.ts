import { InteractionReplyOptions, MessageEmbed } from 'discord.js'
import settings from '../data/settings'

export function ErrorReponse(message: string, command: string): InteractionReplyOptions {
    return {
        embeds: [
            new MessageEmbed()
                .setAuthor('Tarkov Helper')
                .setColor(settings.botSettings.errorColor)
                .setTitle('The command issued had and error')
                .setDescription(`\`${message}\``)
                .setFooter(`Command issued: ${command}`)
        ],
        ephemeral: true
    }
}
