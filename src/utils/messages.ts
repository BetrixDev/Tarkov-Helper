import { Interaction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import { Cache } from '../lib'

export function ErrorReponse(message: string, interaction: Interaction): InteractionReplyOptions {
    if (interaction.isCommand()) {
        const args = interaction.options.data.map((arg) => {
            return `${arg.name}: ${arg.value}`
        })

        return {
            embeds: [
                new MessageEmbed()
                    .setAuthor('Tarkov Helper')
                    .setColor(Cache.config.botSettings.errorColor)
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
                    .setColor(Cache.config.botSettings.errorColor)
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
        this.setColor(altColor ? Cache.config.botSettings.altColor : Cache.config.botSettings.color)
    }
}
