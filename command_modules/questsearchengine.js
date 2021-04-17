const QuestNames = require('../game_data/quest-name.json')

let Quests = new Array()
for (const Quest in QuestNames) {
    Quests.push(QuestNames[Quest].Name.toLowerCase())
}

const Engine = (Input) => {
    if (Quests.includes(Input.toLowerCase())) {
        return [Input]
    } else {
        let Results = new Array()
        for (const Quest of Quests) {
            if (Quest.toLowerCase().split('.').join('').includes(Input)) {
                Results.push(Quest)
            }
        }
        return Results
    }
}

exports.QuestSearchEngine = Engine


/* Used for converting objects names to lowercase
let newqn = {}
for (const Quest in QuestNames) {
    newqn[QuestNames[Quest].Name.toLowerCase()] = {
        Name: QuestNames[Quest].Name,
        ID: QuestNames[Quest].ID
    }
}
require('fs').writeFileSync('./game_data/quest-name.json', JSON.stringify(newqn, null, 2))
*/