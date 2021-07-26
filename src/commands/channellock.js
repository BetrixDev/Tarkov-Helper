// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'channellock',
            description: 'ADMIN COMMAND: Locks Tarkov Helper to only respond in a certain channel',
            options: [{
                type: 7,
                name: 'channel',
                description: 'Which channel to lock the bot to',
                required: true
            }]
        }
    }
}

require('../utils')
const { SetServerData } = require('../database')

// Command Functions
const CommandFunction = (args, { interaction, serverData }) => {
    try {
        if (serverData['AdminRole'] !== 0) {
            if (interaction.member.roles.includes(serverData['AdminRole'])) {
                let Channel = args['channel']

                SetServerData(interaction.guild_id, 'ChannelLock', Channel)

                return { Type: "Ephemeral", Content: `Changed Channel Lock to: ${interaction.data.resolved.channels[Channel].name || Channel}` }
            } else {
                return { Type: "Error", Content: ErrorMessage('Insufficient permission'), Time: 2000 }
            }
        } else {
            return { Type: "Error", Content: ErrorMessage('No admin role set please use \`/admin @role\` to set it'), Time: 10000 }
        }
    } catch {
        return { Type: "Error", Content: ErrorMessage('Error changing channel lock, please try again later'), Time: 5000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings