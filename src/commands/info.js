// Command Config
const CommandSettings = {
    data: {
        name: 'info',
        description: 'Returns basic info on how to use Tarkov Helper',
        options: []
    }
}

const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const PossibleMaps = require('../game_data/maps.json')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')

// Command Functions
const CommandFunction = (args) => {
    return new MessageEmbed()
        .setTitle('Tarkov Helper Information')
        .setThumbnail('https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/Assets/Media/Logo200x200.png')
        .setDescription('A Discord bot to make accessing information within Escape From Tarkov easier')
        .addFields({ name: 'Official Wiki', value: '[Click Here](https://github.com/BetrixEdits/Tarkov-Helper/wiki)' })
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings