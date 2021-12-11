import 'reflect-metadata'

import { CommandInteraction, InteractionReplyOptions, Role } from 'discord.js'
import { Discord, Slash, SlashOption } from 'discordx'
import { SetServerData } from '../../helpers/Database'

/*
    Class for dealing with registering command
*/

@Discord()
export abstract class Command {
    @Slash('admin', {
        description: 'ADMIN COMMAND: Assign an admin role so that role can use admin commands'
    })
    admin(
        @SlashOption('role', {
            description: 'Which role has admin access',
            required: true,
            type: 'ROLE'
        })
        role: Role
    ) {}
}

/*
    Message for command
*/

export default async (interaction: CommandInteraction, args: { role: string }) => {
    return new Promise<InteractionReplyOptions>(async (resolve, error) => {
        const { role } = args

        if (interaction.user.id === interaction.guild?.ownerId) {
            const success = await SetServerData(interaction.guildId, 'AdminRole', role)

            if (success) {
                const roleName = await interaction.guild.roles.fetch(role).then((r) => {
                    return r?.name ?? 'ROLE NAME'
                })

                resolve({
                    content: `Changed admin role to: **${roleName}**`,
                    ephemeral: true
                })
            } else {
                error('There was and error trying to change the admin role, please try again later')
            }
        } else {
            error('Insufficient premission, you must be owner of this server')
        }

        // Give the command 2.5 seconds to respond since discord only allows us 3 seconds to respond
        setTimeout(() => {
            error('The command did not respond in time')
        }, 2500)
    })
}
