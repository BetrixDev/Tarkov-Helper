// Command Config
const CommandSettings = {
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

const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { GetServerData, SetServerData } = require('../command_modules/serverdata')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args, interaction) => {
    try {
        if (GetServerData(interaction.guild_id)['AdminRole'] !== 0) {
            if (interaction.member.roles.includes(GetServerData(interaction.guild_id)['AdminRole'])) {
                let Channel = args['channel']
                console.log(Channel)
                SetServerData(interaction.guild_id, 'ChannelLock', Channel)

                return `Changed Channel Lock to: ${interaction.data.resolved.channels[Channel].name || Channel}`
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