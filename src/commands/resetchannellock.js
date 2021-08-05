require('../utils')
const { SetServerData } = require('../database')

module.exports = {
    data: {
        name: 'resetchannellock',
        description: 'ADMIN COMMAND: Locks Tarkov Helper to only respond in a certain channel',
        options: []
    },
    message: (args, { interaction, serverData, isAdmin }) => {
        try {
            if (serverData['AdminRole'] !== 0) {
                if (isAdmin) {
                    SetServerData(interaction.guildId, 'ChannelLock', "")
                    return { Type: "ephemeral", Content: 'Reset channel lock' }
                } else {
                    return { Type: "error", Content: ErrorMessage('Insufficient permission') }
                }
            } else {
                return { Type: "error", Content: ErrorMessage('No admin role set please use \`/admin @role\` to set it') }
            }
        } catch {
            return { Type: "error", Content: ErrorMessage('Error changing channel lock, please try again later'), }
        }
    }
}