import 'reflect-metadata'
import { MessageEmbed } from 'discord.js'
import { ArgsOf, Client, Discord, On } from 'discordx'
import settings from '../../botConfig'

@Discord()
abstract class Event {
    @On('guildCreate')
    private async newGuild([guild]: ArgsOf<'guildCreate'>) {
        // We use audit logs so we can message the person who invited the bot

        const auditLog = (await guild.fetchAuditLogs({ limit: 1, type: 'BOT_ADD' })).entries.first()

        // Send message to user who added the bot
        auditLog?.executor?.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Thank you for adding Tarkov Helper to ${guild.name}`)
                    .setThumbnail(settings.images.logo250)
                    .setImage(settings.images.secondBanner).setDescription(`
                    • Tarkov Helper is a Discord bot that aims to provide information within **Escape from Tarkov** to users of your Discord server in the easiest way possible.
                    • Tarkov Helper makes use of Discord's slash command API so don't worry about informing your members of any prefixes or compatibility issues between others bots.
                    • Use the \`/help\` command to gain more information about Tarkov Helper
                    • A great first step to ensuring Tarkov Helper is as easy to use as possible you can configure it to your liking, start by using \`/admin @ADMIN_ROLE\`.
                    • To learn more about how to use Tarkov Helper please head over to the [official wiki](https://github.com/BetrixDev/Tarkov-Helper/wiki).
                `)
            ]
        })
    }
}
