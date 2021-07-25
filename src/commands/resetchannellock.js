require('../utils')
const { SetServerData } = require('../database')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'resetchannellock',
            description: 'ADMIN COMMAND: Locks Tarkov Helper to only respond in a certain channel',
            options: []
        }
    }
}

// Command Functions
const CommandFunction = (args, { interaction, serverData }) => {
    try {
        if (serverData['AdminRole'] !== 0) {
            if (interaction.member.roles.includes(serverData['AdminRole'])) {
                SetServerData(interaction.guild_id, 'ChannelLock', "")
                return { Type: "Ephemeral", Content: 'Reset channel lock' }
            } else {
                return { Type: "Error", Content: ErrorMessage('Insufficient permission'), Time: 2000 }
            }
        } else {
            return { Type: "Error", Content: ErrorMessage('No admin role set please use \`/admin @role\` to set it'), Time: 5000 }
        }
    } catch {
        return { Type: "Error", Content: ErrorMessage('Error changing channel lock, please try again later'), Time: 2000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings