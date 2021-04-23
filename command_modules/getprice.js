const got = require('got')

const GetPrice = async(ID) => {
    try {
        const bodyQuery = JSON.stringify({
            query: `{
                item(id: "${ID}") {
                    id
                    name
                    shortName
                    avg24hPrice
                    width
                    height
                    iconLink
                    wikiLink
                    
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })

        return response.body.data.item
    } catch (e) {
        console.log(e)
        return 'ERROR'
    }
}

const GetAllPrices = async() => {
    try {
        const bodyQuery = JSON.stringify({
            query: `{
                itemsByType(type: any) {
                    name
                    normalizedName
                    shortName
                    id
                    avg24hPrice
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })

        let Res = response.body.data.itemsByType
        let FormattedObject = {}

        for (Item in Res) {
            let Itemdata = Res[Item]
            FormattedObject[Itemdata.id] = {
                Name: Itemdata.name,
                ShortName: Itemdata.shortName,
                ID: Itemdata.id,
                Price: Itemdata.avg24hPrice
            }
        }
        return FormattedObject
    } catch (e) {
        console.log(e)
        return 'ERROR'
    }
}

exports.GetPrice = GetPrice
exports.GetAllPrices = GetAllPrices