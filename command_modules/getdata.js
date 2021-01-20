const fs = require('fs')

const GetItems = () => {
    fs.writeFileSync('./game_data/itemnames.json', JSON.stringify({}))
    fs.readFile('./game_data/text/templates.json', (err, data) => {
        let NewJSON = {}
        let JSONData = JSON.parse(data)
        for (const ItemID in JSONData) {
            let name = JSONData[ItemID].Name
            let id = ItemID
            let shortname = JSONData[ItemID].ShortName
            let NewJsonEntry = {
                Name: name,
                ShortName: shortname,
                ID: id
            }
            NewJSON[name] = NewJsonEntry
        }
        fs.writeFileSync('./game_data/itemnames.json', JSON.stringify(NewJSON, null, 2))
    })
}

exports.GetItems = GetItems