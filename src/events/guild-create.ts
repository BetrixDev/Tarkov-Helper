import { ArgsOf, Client, Discord, On } from 'discordx'
import 'reflect-metadata'
import logger from '../config/logger'

const Namespace = 'GuildCreate'

@Discord()
export class GuildCreateEvent {
    @On('guildCreate')
    async guildCreate([guild]: ArgsOf<'guildCreate'>, client: Client) {
        logger.info(Namespace, `Joined new server (${client.guilds.cache.size})`)
    }
}
