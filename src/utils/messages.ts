import { Interaction, InteractionReplyOptions, Message, MessageEmbed } from 'discord.js'
import settings from '../data/settings'

export function ErrorReponse(message: string, interaction: Interaction): InteractionReplyOptions {
    if (interaction.isCommand()) {
        const args = interaction.options.data.map((arg) => {
            return `${arg.name}: ${arg.value}`
        })

        return {
            embeds: [
                new MessageEmbed()
                    .setAuthor('Tarkov Helper')
                    .setColor(settings.botSettings.errorColor)
                    .setTitle('The command issued had and error')
                    .setDescription(`\`${message}\``)
                    .addField('Args', args.length > 0 ? args.join('\n') : 'none')
                    .setFooter(`Command issued: ${interaction.commandName}`)
            ],
            ephemeral: true
        }
    } else {
        return {
            embeds: [
                new MessageEmbed()
                    .setAuthor('Tarkov Helper')
                    .setColor(settings.botSettings.errorColor)
                    .setTitle('The command issued had and error')
                    .setDescription(`\`${message}\``)
                    .setFooter(`Command issued: ${interaction.id}`)
            ],
            ephemeral: true
        }
    }
}

export class THEmbed extends MessageEmbed {
    constructor(altColor?: boolean) {
        super()
        this.setColor(altColor ? settings.botSettings.altColor : settings.botSettings.color)
    }
}
