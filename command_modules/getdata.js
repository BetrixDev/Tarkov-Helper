const fs = require('fs')
var Filter = require('../game_data/itemfilter.json')

const GetItems = () => {
    fs.writeFileSync('./game_data/itemnames.json', JSON.stringify({}))
    fs.readFile('./game_data/items.json', (err, data) => {
        let NewJSON = {}
        let JSONData = JSON.parse(data)
        for (const ItemID in JSONData) {
            let name = JSONData[ItemID]._name
            let id = JSONData[ItemID]._id
            let formattedname = name.split("_").join(" ")
            for (const FilterItem in Filter) {
                let TestItem = Filter[FilterItem]
                if (formattedname.includes(TestItem)) {
                    formattedname = formattedname.split(Filter[FilterItem]).join("")
                }
            }
            let NewJsonEntry = {
                Name: name,
                ID: id
            }
            NewJSON[formattedname] = NewJsonEntry
        }
        fs.writeFileSync('./game_data/itemnames.json', JSON.stringify(NewJSON, null, 2))
    })
}

exports.GetItems = GetItems