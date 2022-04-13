import { CommandInteraction, Interaction, InteractionReplyOptions, MessageEmbed } from 'discord.js'
import botConfig from '../../config/BotConfig'
import logger from '../../config/Logger'
import { translation } from '../../Lib'

const Namespace = 'Messages'

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

/**Calls messageFunc and passes the return value to interaction.reply() or will catch the method and format the string into an errorMessage*/
export const handleCommandInteraction = (
    interaction: CommandInteraction,
    language: Languages,
    messageFunc: Promise<InteractionReplyOptions>
) => {
    const start = Date.now()
    let end: number

    messageFunc
        .then((r) => {
            end = Date.now()
            interaction.reply(r)
        })
        .catch((r) => {
            end = Date.now()
            logger.warn('Messages', 'Error executing command', r)
            interaction.reply(ErrorReponse(r, interaction, language))
        })
        .finally(() => {
            logger.info(
                'Messages',
                `Completed Interaction in ${Date.now() - interaction.createdTimestamp}ms and got the message in ${
                    end - start
                }ms`
            )
        })
}
