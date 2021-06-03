// Command Config
const CommandSettings = {
    CommandData: {
        data: {
            name: 'boss',
            description: 'Returns information on the specified boss',
            options: [{
                name: 'boss',
                description: 'boss to get info of',
                required: true,
                type: 3,
                choices: require('../command_modules/bosses').GetBosses()
            }]
        }
    },
    ReactionData: {
        ":white_circle:": {

        }
    }
}

const fs = require('fs')
const { MessageEmbed } = require('discord.js')
const { ErrorMessage, ErrorMessageField } = require('../command_modules/errormessage')
const { BossInfo } = require('../classes/bossinfo')

// Command Functions
const CommandFunction = (args) => {
    let Boss = args['boss']

    let BossData = new BossInfo(Boss)

    return {
        Type: "ServerMessage",
        Content: new MessageEmbed()
            .setTitle(Boss + ' Information')
            .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/boss_images/${Boss.toLowerCase()}.png`)
            .addFields({
                name: 'Spawns on',
                value: BossData.Map,
                inline: true
            }, {
                name: 'Spawn Chance',
                value: BossData.SpawnChance + '%',
                inline: true
            }, {
                name: 'Spawn Locations',
                value: BossData.SpawnPoints.length,
                inline: true
            }, {
                name: 'Health',
                value: BossData.Health(),
                inline: true
            }, {
                name: '\u200b',
                value: '\u200b',
                inline: true
            }, {
                name: 'Followers',
                value: BossData.Followers(),
                inline: true
            }, {
                name: 'Attributes',
                value: BossData.Attributes(),
                inline: true
            })
    }
}

exports.CommandFunction = CommandFunction
exports.CommandSettings = CommandSettings