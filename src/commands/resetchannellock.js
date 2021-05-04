// Command Config
const CommandSettings = {
    data: {
        name: 'resetchannellock',
        description: 'ADMIN COMMAND: Locks Tarkov Helper to only respond in a certain channel',
        options: []
    }
}

const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { GetServerData, SetServerData } = require('../command_modules/serverdata')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args, interaction) => {
    try {
        if (GetServerData(interaction.guild_id)['AdminRole'] !== 0) {
            if (interaction.member.roles.includes(GetServerData(interaction.guild_id)['AdminRole'])) {
                SetServerData(interaction.guild_id, 'ChannelLock', 0)
                return 'Reset channel lock'
            } else {
                return ErrorMessage('Insufficient permission')
            }
        } else {
            return ErrorMessage('No admin role set please use \`/admin @role\` to set it')
        }
    } catch {
        return ErrorMessage('Error changing channel lock, please try again later')
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings