import 'reflect-metadata'
import { CommandInteraction } from 'discord.js'
import { Client, Discord, Slash, SlashChoice, SlashOption } from 'discordx'
import { handleCommandInteraction, translation } from '../lib'
import { setDatabase } from '../database/server'

enum ErrorMessages {
    MUST_BE_OWNER = 'You must be the owner of this server to use this command',
    UNKNOWN_ERROR = 'There was an error trying to set the language, please try again later'
}

@Discord()
export class LanguageCommand {
    private isOwner(interaction: CommandInteraction) {
        return interaction.user.id === interaction.guild?.ownerId
    }

    @Slash('language', {
        description: 'Change the default language TarkovHelper will respond in for this server'
    })
    async language(
        @SlashChoice('English', 'en')
        @SlashChoice('pусский', 'ru')
        @SlashChoice('Español', 'es')
        @SlashChoice('Deutsch', 'ge')
        @SlashOption('language', { description: 'Language that TarkovHelper will respond in' })
        language: string,
        interaction: CommandInteraction,
        client: Client,
        { serverData: { Language } }: GuardData
    ) {
        handleCommandInteraction(
            interaction,
            Language,
            new Promise(async (respond, error) => {
                const t = translation(language)

                if (!this.isOwner(interaction)) {
                    error(t(ErrorMessages.MUST_BE_OWNER))
                }

                const success = await setDatabase(interaction.guildId ?? '', 'Language', language)

                if (success) {
                    respond({ content: t('Successfully set the language for this server'), ephemeral: true })
                } else {
                    error(t(ErrorMessages.UNKNOWN_ERROR))
                }
            })
        )
    }
}
