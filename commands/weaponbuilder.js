/*
// Load modules
const fs = require('fs')

// Load command_modules
const { WeaponSearchEngine } = require('../command_modules/weaponsearchengine')
const { ErrorMessage } = require('../command_modules/errormessage')

// Load game data
let ItemData = JSON.parse(fs.readFileSync('./game_data/weaponbuilder/items.json')).data
let WeaponData = JSON.parse(fs.readFileSync('./game_data/weaponbuilder/weapons.json'))

module.exports = {
    name: 'weaponbuilder',
    description: "",
    execute(message, args, Discord) {

        // Get search engine result
        let EngineResult = WeaponSearchEngine(args)
        let SearchItem = EngineResult[0]
        let SearchResults = EngineResult[1]
        let ItemResults = EngineResult[2]

        if (SearchItem !== undefined && SearchItem.length > 1) {
            if (SearchResults.length > 1 && SearchResults.length < 10) {

                ErrorMessage('The search result came back with multiple quests, please be more specific', message, [{ name: 'Results:', value: SearchResults }])

            } else if (SearchResults.length === 1) {

                let Weapon = ItemResults[0]
                let WeaponID = WeaponData[Weapon].ID
                console.log(Weapon)

            }
        }
    }
}
*/