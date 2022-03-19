import 'reflect-metadata'
import { GuardFunction } from 'discordx'
import { CommandInteraction, Interaction } from 'discord.js'
import { translation } from '../lib'

const isOwner = (interaction: Interaction) => interaction.guild?.ownerId === interaction.user.id

export const ChannelLockGuard: GuardFunction<CommandInteraction, GuardData> = async (arg, client, next, guardData) => {
    const interaction = arg instanceof Array ? arg[0] : arg

    if (interaction instanceof CommandInteraction && interaction.guild && !isOwner(interaction)) {
        if (interaction.channelId !== guardData.serverData.ChannelLock) {
            const channelName = await interaction.guild.channels.fetch(guardData.serverData.ChannelLock)

            const t = translation(guardData.serverData.Language)

            interaction.reply({
                content: t('This channel is locked, please use: **{0}**', channelName?.name ?? t('UNKNOWN')),
                ephemeral: true
            })
        } else {
            next()
        }
    } else {
        next()
    }
}
