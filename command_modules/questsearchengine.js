const QuestNames = require('../game_data/questnames.json')

const Engine = (Input) => {
    if (QuestNames.includes(Input.toLowerCase())) {
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