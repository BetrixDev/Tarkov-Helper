// Command Config
const CommandSettings = {
    CommandData: {
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
}


const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { GetServerData, SetServerData } = require('../command_modules/serverdata')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args, obj) => {
    try {
        if (GetServerData(obj.interaction.guild_id)['AdminRole'] !== 0) {
            if (obj.interaction.member.roles.includes(GetServerData(obj.interaction.guild_id)['AdminRole'])) {
                let Time = args['time']
                if (Time > 0 && Time < 61) {
                    SetServerData(obj.interaction.guild_id, 'Cooldown', Time)

                    return { Type: "ServerMessage", Content: `Changed Cooldown time to: ${Time}` }
                } else {
                    return { Type: "ServerMessage", Content: ErrorMessage('Please make sure Cooldown is between 0 and 60 seconds'), Time: 5000 }
                }
            } else {
                return { Type: "ServerMessage", Content: ErrorMessage('Insufficient permission'), Time: 2000 }
            }
        } else {
            return { Type: "ServerMessage", Content: ErrorMessage('No admin role set please use \`/admin @role\` to set it'), Time: 5000 }
        }
    } catch {
        return { Type: "ServerMessage", Content: ErrorMessage('Error changing cooldown time, please try again later'), Time: 3000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings