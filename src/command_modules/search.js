const fs = require('fs')
let ItemFromName = JSON.parse(fs.readFileSync('./src/game_data/api/itemfromname.json'))
let Searches = new Object(null)


function CreateInput(Inputs, cmd, uid) {

    if (cmd === 'quest') {
        Searches[uid] = {
            Command: cmd,
            Inputs: Inputs,
            IDs: Inputs
        }
    } else {
        Searches[uid] = {
            Command: cmd,
            Inputs: Inputs,
            IDs: Inputs.map(item => { return ItemFromName[item].ID })
        }
    }

    // Create array to send back
    let Message = new Array()
    for (const i in Inputs) {
        let pos = Number(i) + 1
        Message.push(`\`${pos}\` **-** ${Inputs[i]}`)
    }

    return Message
}

function CreateBarterInput(Inputs, Item, uid) {
    Searches[uid] = {
        Command: 'internalbarter',
        Item: Item,
        Inputs: Inputs
    }

    // Create array to send back
    let Message = new Array()
    for (const i in Inputs) {
        let pos = Number(i) + 1
        let Ingredients = new Array()

        for (const Ingredient of Inputs[i].RequiredItems) {
            Ingredients.push(`**${Ingredient.Amount}x** - ${Ingredient.ShortName}`)
        }
        Message.push(`\`${pos}\` **-** Ingredients: ${Ingredients.join(' **|** ')}`)
    }

    return Message
}

function RemoveSearch(uid) {
    try {
        delete Searches[uid]
    } catch {}
}

function OpenSearch(uid) {
    if (Searches[uid] !== undefined) {
        return true
    } else {
        return false
    }
}

function GetSearchObj(uid) {
    return Searches[uid]
}

exports.CreateBarterInput = CreateBarterInput
exports.CreateInput = CreateInput
exports.RemoveSearch = RemoveSearch
exports.OpenSearch = OpenSearch
exports.GetSearchObj = GetSearchObj