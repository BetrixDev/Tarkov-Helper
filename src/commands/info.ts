import 'reflect-metadata'
import { Client, CommandInteraction, InteractionReplyOptions, MessageActionRow, MessageButton } from 'discord.js'
import { Discord, Slash } from 'discordx'
import botConfig from '../config/bot-config'
import { THEmbed, translation } from '../lib'
import { injectable } from 'tsyringe'

@Discord()
@injectable()
export class InfoCommand {
    @Slash('info', {
        description: 'Returns basic info on how to use Tarkov Helper'
    })
    async info(
        interaction: CommandInteraction,
        client: Client,
        { Language }: ServerData
    ): Promise<InteractionReplyOptions> {
        const t = translation(Language)

        return new Promise((respond, error) => {
            respond({
                embeds: [
                    new THEmbed()
                        .setTitle(t('Info'))
                        .setThumbnail(botConfig.images.logo250)
                        .setImage(botConfig.images.slashBanner)
                        .setDescription(t('Info Command Description'))
                ],
                components: [
                    new MessageActionRow().addComponents([
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel(t('Wiki'))
                            .setURL('https://github.com/BetrixDev/Tarkov-Helper/wiki'),
                        new MessageButton()
                            .setStyle('LINK')
                            .setLabel(t('Invite Link'))
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
