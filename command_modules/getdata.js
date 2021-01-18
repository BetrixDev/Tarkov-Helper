const fs = require('fs')


const GetItems = () => {
    fs.writeFileSync('./game_data/itemnames.json', JSON.stringify({}))
    fs.readFile('./game_data/items.json', (err, data) => {
        let NewJSON = {}
        let JSONData = JSON.parse(data)
        for (const ItemID in JSONData) {
            let name = JSONData[ItemID]._name
            let id = JSONData[ItemID]._id
            let NewJsonEntry = {
                Name: name,
                ID: id
            }
            NewJSON[name] = NewJsonEntry
        }
        fs.writeFileSync('./game_data/itemnames.json', JSON.stringify(NewJSON, null, 2))
    })
}

exports.GetItems = GetItems