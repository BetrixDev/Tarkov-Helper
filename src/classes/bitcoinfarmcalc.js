const fs = require('fs')

class BitcoinFarmCalc {
    constructor(gpus) {
        this.ItemPriceData = JSON.parse(fs.readFileSync('./src/game_data/pricedata.json'))
        this.BTCPrice = this.ItemPriceData['59faff1d86f7746c51718c9c'].Item.traderPrices[4].price
        this.BTCPerDay = (1 / ((110000 / (1 + (gpus - 1) * 0.044225)) / 3600)) * 24
        this.RUBPerDay = this.BTCPerDay * this.BTCPrice
    }
}

exports.BitcoinFarmCalc = BitcoinFarmCalc