import { Client, CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { container, injectable } from 'tsyringe'
import { setDatabase } from '../database/server'
import { handleCommandInteraction, translation } from '../lib'

enum ErrorMessages {
    MUST_BE_OWNER = 'You must be the owner of this server to use this command',
    COOLDOWN_TIME = 'Cooldown should be between 0 and 60 seconds',
    UNKNWON_ERROR = 'Error changing cooldown time, please try again later'
}

@Discord()
@injectable()
export class CooldownCommand {
    private isOwner(interaction: CommandInteraction) {
        return interaction.user.id === interaction.guild?.ownerId
    }

    @Slash('cooldown', {
        description: 'Sets the cooldown time. default: 3 seconds'
    })
    async cooldown(
        @SlashOption('time', {
            description: 'Cooldown length'
        })
        time: number,
        interaction: CommandInteraction,
        client: Client,
        { serverData }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            serverData.Language,
            new Promise(async (respond, error) => {
                const t = translation(serverData.Language)

                if (!this.isOwner(interaction)) error(t(ErrorMessages.MUST_BE_OWNER))
                if (time < 0 || time > 61) error(t(ErrorMessages.COOLDOWN_TIME))

                const success = await setDatabase(interaction.guildId ?? '', 'Cooldown', time)

                if (success) {
                    respond({ content: t('Changed cooldown time to: **{0}**', time) })
                } else {
                    error(t(ErrorMessages.UNKNWON_ERROR))
                }
            })
        )
    }
}
