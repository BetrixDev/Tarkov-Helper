const fs = require('fs')

const GetQuests = () => {
    fs.writeFileSync('./game_data/questnames.json', JSON.stringify({}))
    fs.readFile('./game_data/quest.json', (err, data) => {
        let NewJSON = {}
        let JSONData = JSON.parse(data)
        for (const QuestID in JSONData) {
            let name = JSONData[QuestID].name
            let id = QuestID
            let NewJsonEntry = {
                Name: name,
                ID: id
            }
            NewJSON[name] = NewJsonEntry
        }
        fs.writeFileSync('./game_data/questnames.json', JSON.stringify(NewJSON, null, 2))
    })
}

exports.GetQuests = GetQuests