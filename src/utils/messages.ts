import { Interaction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import botConfig from '../config/bot-config'
import { translation } from '../lib'

export function ErrorReponse(message: string, interaction: Interaction, language: Languages): InteractionReplyOptions {
    const t = translation(language)

    if (interaction.isCommand()) {
        const args = interaction.options.data.map((arg) => {
            return `${arg.name}: ${arg.value}`
        })

        return {
            embeds: [
                new MessageEmbed()
                    .setAuthor({ name: 'Tarkov Helper' })
                    .setColor(botConfig.botSettings.errorColor)
                    .setTitle(t('The command issued had and error'))
                    .setDescription(`\`${message}\``)
                    .addField('Args', args.length > 0 ? args.join('\n') : 'none')
                    .setFooter({ text: t('Command issued: {0}', interaction.commandName) })
            ],
            ephemeral: true
        }
    } else {
        return {
            embeds: [
                new MessageEmbed()
                    .setAuthor({ name: 'Tarkov Helper' })
                    .setColor(botConfig.botSettings.errorColor)
                    .setTitle(t('The command issued had and error'))
                    .setDescription(`\`${message}\``)
                    .setFooter({ text: t('Command issued: {0}', interaction.id) })
            ],
            ephemeral: true
        }
    }
}

export class THEmbed extends MessageEmbed {
    constructor(altColor?: boolean) {
        super()
        this.setColor(altColor ? botConfig.botSettings.altColor : botConfig.botSettings.color)
    }
}
