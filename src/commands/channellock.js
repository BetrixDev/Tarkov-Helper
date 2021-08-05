require('../utils')
const { SetServerData } = require('../database')

module.exports = {
    data: {
        name: 'channellock',
        description: 'ADMIN COMMAND: Locks Tarkov Helper to only respond in a certain channel',
        options: [{
            type: 7,
            name: 'channel',
            description: 'Which channel to lock the bot to',
            required: true
        }]
    },
    message: async(args, { interaction, serverData, isAdmin, guild }) => {
        try {
            if (serverData['AdminRole'] !== 0) {
                if (isAdmin) {
                    let Channel = args['channel']

                    SetServerData(interaction.guildId, 'ChannelLock', Channel)

                    return { Type: "ephemeral", Content: `Changed Channel Lock to: **${await guild.channels.fetch(Channel).then(channel => {return channel.name })}**` }
                } else {
                    return { Type: "error", Content: ErrorMessage('Insufficient permission') }
                }
            } else {
                return { Type: "error", Content: ErrorMessage('No admin role set please use \`/admin @role\` to set it') }
            }
        } catch (e) {
            console.log(e)
            return { Type: "error", Content: ErrorMessage('Error changing channel lock, please try again later') }
        }
    }
}