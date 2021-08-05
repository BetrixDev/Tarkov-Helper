require('../utils')
const { SetServerData } = require('../database')

module.exports = {
    data: {
        name: 'setcooldown',
        description: 'ADMIN COMMAND: Sets the cooldown time. default: 3 seconds',
        options: [{
            type: 4,
            name: 'time',
            description: 'Cooldown time',
            required: true
        }]
    },
    message: (args, { interaction, serverData, isAdmin }) => {
        try {
            if (serverData['AdminRole'] !== "") {
                if (isAdmin) {
                    let Time = args['time']
                    if (Time > 0 && Time < 61) {
                        SetServerData(interaction.guildId, 'Cooldown', Number(Time))

                        return { Type: "ephemeral", Content: `Changed Cooldown time to: ${Time}` }
                    } else {
                        return { Type: "error", Content: ErrorMessage('Please make sure Cooldown is between 0 and 60 seconds') }
                    }
                } else {
                    return { Type: "error", Content: ErrorMessage('Insufficient permission') }
                }
            } else {
                return { Type: "error", Content: ErrorMessage('No admin role set please use \`/admin @role\` to set it') }
            }
        } catch {
            return { Type: "error", Content: ErrorMessage('Error changing cooldown time, please try again later') }
        }
    }
}