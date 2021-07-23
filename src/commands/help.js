const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'help',
            description: 'Returns basic info on how to use Tarkov Helper',
            options: []
        }
    },
    DMCommand: true
}

// Command Functions
const CommandFunction = (args, obj) => {
    return require('./info').CommandFunction(args, obj)
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings