import 'reflect-metadata'
import { InteractionReplyOptions, MessageActionRow, MessageButton } from 'discord.js'
import { Discord, Slash } from 'discordx'
import botConfig from '../config/bot-config'
import { THEmbed } from '../lib'
import { injectable } from 'tsyringe'
import { Item } from '../data/classes/item'
import { writeFile } from 'jsonfile'

@Discord()
@injectable()
export class InfoCommand {
    @Slash('info', {
        description: 'Returns basic info on how to use Tarkov Helper'
    })
    async info(): Promise<InteractionReplyOptions> {
        return new Promise((respond, error) => {
            console.time('Got Item Class')
            const item = new Item('59e690b686f7746c9f75e848', 'es')
            console.timeEnd('Got Item Class')
            writeFile('item.json', item)

            respond({
                embeds: [
                    new THEmbed()
                        .setTitle('Info')
                        .setThumbnail(botConfig.images.logo250)
                        .setImage(botConfig.images.slashBanner)
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
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('Twitter')
                            .setURL('https://twitter.com/tarkovhelper'),
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel('Top.gg')
                            .setURL('https://top.gg/bot/797600238449590334')
                    ])
                ],
                ephemeral: true
            })
        })
    }
}
