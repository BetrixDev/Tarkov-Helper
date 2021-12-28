import 'reflect-metadata'
import { Discord, Slash } from 'discordx'
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { ErrorReponse } from '../lib'
import settings from '../data/settings'

@Discord()
export class InfoCommand {
    @Slash('info', {
        description: 'Returns basic info on how to use Tarkov Helper'
    })
    dogtag(interaction: CommandInteraction) {
        try {
            interaction.reply(this.message())
        } catch (e) {
            console.log(e)
            interaction.reply(ErrorReponse('There was an unknown error executing this command', interaction))
        }
    }

    message() {
        return {
            embeds: [
                new MessageEmbed()
                    .setColor(settings.botSettings.color)
                    .setTitle('Tarkov Helper Infomation')
                    .setThumbnail(settings.images.logo250)
                    .setImage(settings.images.slashBanner)
                    .setDescription(
                        `
                        • A Discord bot to make accessing information within Escape From Tarkov easier.
                        • Start a command by typing \`/\` in the message box and follow each command's guide
                        • If you don't see anything make sure you have slash commands enabled by going to **User Settings > Text & Images**, and enable \"Use slash commands...\"
                        • If you still don't see anything ask the server owner or admins if slash commands are enabled in that specific channel or DM Tarkov Helper to use the commands instead
                    `
                    )
            ],
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Wiki')
                        .setURL('https://github.com/BetrixDev/Tarkov-Helper/wiki'),
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Invite Link')
                        .setURL('https://top.gg/bot/797600238449590334/invite/'),
                    new MessageButton().setStyle('LINK').setLabel('Twitter').setURL('https://twitter.com/tarkovhelper'),
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Top.gg')
                        .setURL('https://top.gg/bot/797600238449590334')
                ])
            ],
            ephemeral: true
        }
    }
}
