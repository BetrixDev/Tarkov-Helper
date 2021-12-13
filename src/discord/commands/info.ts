import 'reflect-metadata'

import { InteractionReplyOptions, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { Discord, Slash } from 'discordx'

import Settings from '../../botConfig'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('info', {
        description: 'Returns basic info on how to use Tarkov Helper'
    })
    info() {}
}

/*
    Message for command
*/

export default async (): Promise<InteractionReplyOptions> => {
    return {
        embeds: [
            new MessageEmbed()
                .setColor(Settings.botSettings.color)
                .setTitle('Tarkov Helper Infomation')
                .setThumbnail(Settings.images.logo250)
                .setImage(Settings.images.slashBanner)
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
                new MessageButton().setStyle('LINK').setLabel('Wiki').setURL('https://github.com/BetrixDev/Tarkov-Helper/wiki'),
                new MessageButton().setStyle('LINK').setLabel('Invite Link').setURL('https://top.gg/bot/797600238449590334/invite/'),
                new MessageButton().setStyle('LINK').setLabel('Twitter').setURL('https://twitter.com/tarkovhelper'),
                new MessageButton().setStyle('LINK').setLabel('Top.gg').setURL('https://top.gg/bot/797600238449590334')
            ])
        ],
        ephemeral: true
    }
}
