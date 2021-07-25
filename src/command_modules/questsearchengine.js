require('../utils')
const QuestNames = ReadJson('./src/game_data/api/questnames.json')

const Engine = (Input) => {
    if (QuestNames.includes(Input)) {
        return [Input]
    } else {
        let Results = new Array()
        for (const Quest in QuestNames) {
            if (QuestNames[Quest].toLowerCase().split('.').join('').includes(Input)) {
                Results.push(QuestNames[Quest])
            }
        }
        return Results
    }
}

exports.QuestSearchEngine = Engine