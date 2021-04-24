const got = require('got')
const fs = require('fs')

const GetPrice = async(ID) => {
    try {
        const PriceData = JSON.parse(fs.readFileSync('./game_data/pricedata.json'))
        return PriceData[ID].Item
    } catch (e) {
        console.log(e)
        return 'ERROR'
    }
}

const GetAllPrices = async() => {
    try {
        return PriceData = JSON.parse(fs.readFileSync('./game_data/pricedata.json'))
    } catch (e) {
        console.log(e)
        return 'ERROR'
    }
}

exports.GetPrice = GetPrice
exports.GetAllPrices = GetAllPrices