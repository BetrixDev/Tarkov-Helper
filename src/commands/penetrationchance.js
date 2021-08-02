require('../utils')
const { MessageEmbed } = require('discord.js')

// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'penetrationchance',
            description: 'Gets the chance of a bullet penetrating a certain armor',
            options: [{
                name: 'bullet',
                description: 'Bullet to shoot',
                required: true,
                type: 3
            }, {
                name: 'armor',
                description: 'Armor to use',
                required: true,
                type: 4
            }, {
                name: 'durability',
                description: 'Current Durability of the armor',
                required: false,
                type: 3
            }, {
                name: 'max-durability',
                description: 'Max-durability of the armor',
                required: false,
                type: 3
            }]
        }
    }
}

// Command Functions
const CommandFunction = (args, obj) => {
    let bullet = args['bullet']
    let armor = args['armor']
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings