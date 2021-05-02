// Command Config
const CommandSettings = {
    data: {
        name: 'setcooldown',
        description: 'ADMIN COMMAND: Sets the cooldown time. default: 3 seconds',
        options: [{
            type: 4,
            name: 'time',
            description: 'Cooldown time',
            required: true
        }]
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
                let Time = args['time']
                if (Time > 0 && Time < 61) {
                    SetServerData(interaction.guild_id, 'Cooldown', Time)

                    return `Changed Cooldown time to: ${Time}`
                } else {
                    return ErrorMessage('Please make sure Cooldown is between 0 and 60 seconds')
                }
            } else {
                return ErrorMessage('Insufficient permission')
            }
        } else {
            return ErrorMessage('No admin role set please use \`/admin @role\` to set it')
        }
    } catch {
        return ErrorMessage('Error changing cooldown time, please try again later')
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings