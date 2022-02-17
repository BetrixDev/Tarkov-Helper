import { ArgsOf, Client, Discord, On } from 'discordx'
import 'reflect-metadata'
import logger from '../config/logger'

const Namespace = 'GuildDelete'

@Discord()
export class GuildDeleteEvent {
    @On('guildDelete')
    async guildDelete([guild]: ArgsOf<'guildDelete'>, client: Client) {
        logger.info(Namespace, `left server (${client.guilds.cache.size})`)
    }
}
