require('../utils')
const Search = require('../command_modules/search')

module.exports = {
    data: {
        name: 'confirm',
        description: 'Use this to command when you have a search pending to finalize a search',
        options: [{
            name: 'position',
            description: 'What item number to confirm the search of',
            required: true,
            type: 3
        }]
    },
    message: (args, obj) => {
        let { uid } = obj

        let pos = args['position']

        if (Search.OpenSearch(uid)) {
            let Searches = Search.GetSearchObj(uid)

            if (Searches['Inputs'].length < Number(pos)) {
                return {
                    Type: "error",
                    Content: ErrorMessage('Invalid position')
                }
            } else {
                Search.RemoveSearch(uid)

                if (Searches.Command === 'internalbarter') {
                    return require(`./barter`).message({
                        item: Searches['Item']
                    }, {...obj,
                        Barter: (pos - 1)
                    })
                } else {
                    return require(`./${Searches.Command}`).message({
                        questname: Searches['IDs'][pos - 1],
                        item: Searches['IDs'][pos - 1],
                        caliber: Searches['IDs'][pos - 1],
                        ...Searches['otherArgs']
                    }, obj)
                }
            }
        } else {
            return {
                Type: "error",
                Content: ErrorMessage('You current don\'t have an open search pending')
            }
        }
    }
}