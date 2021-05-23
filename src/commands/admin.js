// Command Config
const CommandSettings = {
    CommandData: {
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
}

const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { GetServerData, SetServerData } = require('../command_modules/serverdata')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args, obj) => {
    try {
        if (obj.interaction.member.user.id === obj.guild.ownerID) {
            let Role = args['role']
            SetServerData(obj.interaction.guild_id, 'AdminRole', Role)

            return { Type: "ServerMessage", Content: `Changed Role to: ${obj.interaction.data.resolved.roles[Role].name || Role}` }
        } else {
            return { Type: "Error", Content: ErrorMessage('Insufficient permission'), Time: 5000 }
        }
    } catch (e) {
        console.log(e)
        return { Type: "Error", Content: ErrorMessage('Error changing admin role, please try again later'), Time: 5000 }
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings