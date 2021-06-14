const { GetServerData, SetServerData } = require('../command_modules/serverdata')
const { ErrorMessage } = require('../command_modules/errormessage')

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

// Command Functions
const CommandFunction = (args, { interaction }) => {
    try {
        if (GetServerData(interaction.guild_id)['AdminRole'] !== 0) {
            if (interaction.member.roles.includes(GetServerData(interaction.guild_id)['AdminRole'])) {
                let Time = args['time']
                if (Time > 0 && Time < 61) {
                    SetServerData(interaction.guild_id, 'Cooldown', Time)

                    return { Type: "Ephemeral", Content: `Changed Cooldown time to: ${Time}` }
                } else {
                    return { Type: "Error", Content: ErrorMessage('Please make sure Cooldown is between 0 and 60 seconds'), Time: 5000 }
                }
            } else {
                return { Type: "Error", Content: ErrorMessage('Insufficient permission'), Time: 2000 }
            }
        } else {
            return { Type: "Error", Content: ErrorMessage('No admin role set please use \`/admin @role\` to set it'), Time: 5000 }
        }
    } catch {
        return { Type: "Error", Content: ErrorMessage('Error changing cooldown time, please try again later'), Time: 3000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings