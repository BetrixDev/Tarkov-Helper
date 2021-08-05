const { MessageEmbed } = require('discord.js')
const { BossInfo } = require('../classes/bossinfo')

const Translations = {
    BossNames: {
        bossgluhar: 'Gluhkar',
        bosskilla: 'Killa',
        bossbully: 'Reshala',
        bosssanitar: 'Sanitar',
        bosskojaniy: 'Shturman',
        bosstagilla: 'Tagilla'
    },
    MapNames: {
        rezervbase: 'Reserve',
        interchange: 'Interchange',
        bigmap: 'Customs',
        shoreline: 'Shoreline',
        woods: 'Woods',
        factory4_day: 'Factory'
    }
}

module.exports = {
    data: {
        name: 'boss',
        description: 'Returns information on the specified boss',
        options: [{
            name: 'boss',
            description: 'boss to get info of',
            required: true,
            type: 3,
            choices: [{
                name: 'Gluhkar',
                value: 'bossgluhar'
            }, {
                name: 'Killa',
                value: 'bosskilla'
            }, {
                name: 'Reshala',
                value: 'bossbully'
            }, {
                name: 'Sanitar',
                value: 'bosssanitar'
            }, {
                name: 'Shturman',
                value: 'bosskojaniy'
            }, {
                name: 'Tagilla',
                value: 'bosstagilla'
            }]
        }]
    },
    message: function(args) {
        let Boss = args['boss']

        let BossData = new BossInfo(Boss)

        return {
            Type: "serverMessage",
            Content: new MessageEmbed()
                .setColor(Settings.BotSettings.Color)
                .setTitle(Translations.BossNames[Boss] + ' Information')
                .setThumbnail(`https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/boss_images/${Boss.toLowerCase()}.png`)
                .addFields(ResolveStrings([{
                    name: 'Spawns on',
                    value: Translations.MapNames[BossData.Map],
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
                }]))
        }
    }
}