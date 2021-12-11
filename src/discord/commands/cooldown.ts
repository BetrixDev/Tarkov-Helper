import 'reflect-metadata'

import { CommandInteraction, InteractionReplyOptions, Role, TextChannel } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { ServerData, SetServerData } from '../../helpers/Database'
import { AdminCheck } from '../../Lib'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('cooldown', {
        description: 'ADMIN COMMAND: Sets the cooldown time. default: 3 seconds'
    })
    cooldown(
        @SlashOption('time', {
            description: 'Cooldown length',
            required: true
        })
        time: number,
        interaction: CommandInteraction
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, { time }: { time: number }, serverData: ServerData) => {
    return new Promise<InteractionReplyOptions>(async (resolve, error) => {
        try {
            if (serverData.AdminRole === '') error('No admin role set please use `/admin @role` to set it')
            if (!AdminCheck(interaction, serverData.AdminRole)) error('Insufficient permission')
            if (time < 0 && time < 61) error('Please make sure Cooldown is between 0 and 60 seconds')

            SetServerData(interaction.guildId, 'Cooldown', time)
            resolve({ content: `Changed Cooldown time to: **${time}s**`, ephemeral: true })
        } catch (e) {
            console.log(e)
            error('Error changing cooldown time, please try again later')
        }

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}
