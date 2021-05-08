// Command Config
const CommandSettings = {
    data: {
        name: 'admin',
        description: 'ADMIN COMMAND: Assign an admin role so that role can use admin commands',
        options: [{
            type: 8,
            name: "role",
            description: "Which roles has admin access",
            required: true
        }]
    }
}

const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { GetServerData, SetServerData } = require('../command_modules/serverdata')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args, interaction, guild) => {
    try {
        if (interaction.member.user.id === guild.ownerID) {
            let Role = args['role']
            SetServerData(interaction.guild_id, 'AdminRole', Role)

            return `Changed Role to: ${interaction.data.resolved.roles[Role].name || Role}`
        } else {
            return ErrorMessage('Insufficient permission')
        }
    } catch {
        return ErrorMessage('Error changing admin role, please try again later')
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings
