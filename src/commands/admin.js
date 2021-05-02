// Command Config
const CommandSettings = {
    data: {
        name: 'admin',
        description: 'ADMIN COMMAND: Returns basic info on how to use Tarkov Helper',
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

            return `Changed Role to id: ${Role}`
        } else {
            return ErrorMessage('Insufficient permission')
        }
    } catch {
        return ErrorMessage('Error changing admin role, please try again later')
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings