const got = require('got')

const BitcoinFarmCalc = async(amount) => {
    let BTCPrice = await BitcoinPrice()
    let BTCPerDay = (1 / ((110000 / (1 + (amount - 1) * 0.044225)) / 3600)) * 24
    let RUBPerDay = BTCPerDay * BTCPrice

    return { BTCPrice, BTCPerDay, RUBPerDay }
}

const BitcoinPrice = async() => {
    try {
        const bodyQuery = JSON.stringify({
            query: `{
                item(id: "59faff1d86f7746c51718c9c") {
                    name
                    traderPrices {
                      price
                    }
                }
            }`
        })
        const response = await got.post('https://tarkov-tools.com/graphql', {
            body: bodyQuery,
            responseType: 'json',
        })

        return response.body.data.item.traderPrices[0].price
    } catch (e) {
        console.log(e)
        return 0
    }
}

exports.BitcoinFarmCalc = BitcoinFarmCalc