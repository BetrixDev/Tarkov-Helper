import 'reflect-metadata'
import { CommandInteraction, ContextMenuInteraction, SelectMenuInteraction, ButtonInteraction } from 'discord.js'
import { GuardFunction } from 'discordx'
import { queryDatabase } from '../database/server'

export const InjectServerData: GuardFunction<
    CommandInteraction | ContextMenuInteraction | SelectMenuInteraction | ButtonInteraction
> = async ({ guildId }, client, next, guardData) => {
    guardData.serverData = await queryDatabase(guildId ?? '')
    next()
}
