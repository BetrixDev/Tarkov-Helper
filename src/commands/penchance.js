require('../utils')
const { PenetrationCalculator } = require('../classes/simulator/penetrationcalculator')
const { Search } = require('../classes/searchengine')
const ItemIDs = ReadJson('./src/game_data/api/itemfromid.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: {
        name: 'penchance',
        description: 'Calculates the chance for a bullet to penetrate a piece of armor',
        options: [{
            type: 3,
            name: "bullet",
            description: "First item to compare with",
            required: true
        }, {
            type: 3,
            name: "armor",
            description: "can be a helmet, body armor or armored rig",
            required: true
        }]
    },
    message: async function (args) {

        let items = [
            new Search({ types: ['ammo'] }).Results(args['bullet']),
            new Search({ types: ['armor', 'helmet'] }).Results(args['armor'])
        ]

        for (let i in items) {
            let item = items[i]
            let results = item.results
            let field = i == 0 ? 'bullet' : 'armor'

            if (results.length > 1) {
                return CreateSearchInput(results, args, field, 'penchance')
            } else if (item.error) {
                return { Type: 'error', Content: item.error }
            }

            items[i] = results[0].id || results[0].ID
        }

        let simulator = new PenetrationCalculator(items[1], items[0])

        let simResults = simulator.Simulate(1000)

        let itemNames = [
            ItemIDs[items[0]],
            ItemIDs[items[1]]
        ]

        return {
            Type: 'serverMessage',
            Content: new MessageEmbed()
                .setTitle('Penetration Calculator')
                .setDescription(`The listed values are from a simulation between **${itemNames[0].ShortName}** and **${itemNames[1].ShortName}** run 1000 times`)
                .addFields(ResolveStrings([{
                    name: 'Pen Chances (set durabilities)',
                    value: simulator.ChanceSummary(),
                    inline: true
                }, {
                    name: 'Average Shots to Pen',
                    value: Math.round(simResults.averageShotsToPen * 10000) / 10000,
                    inline: true
                }, {
                    name: 'Average Shots to Zero',
                    value: Math.round(simResults.averageShotsToZero * 10000) / 10000,
                    inline: true
                }]))
        }
    }
}