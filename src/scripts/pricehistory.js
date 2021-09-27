require('../utils')
const fs = require('fs')
const moment = require('moment-timezone')

let ItemData = ReadJson('./src/game_data/api/itemdata.json')
let PriceData = ReadJson('./src/game_data/api/pricedata.json')

const priceHistoryDir = './src/game_data/pricehistory/'

module.exports = () => {
    const file = priceHistoryDir + moment().tz('America/New_York').format('MM-DD').toUpperCase() + '.json'
    let date = Date.now()

    let history = {}

    if (fs.existsSync(file)) {
        history = ReadJson(file)
    } else {
        Object.keys(ItemData).forEach(id => {
            history[id] = []
        })
    }

    for (let id in history) {
        let price = PriceData[id].Item.lastLowPrice

        history[id].push({ price, date })
    }

    WriteJson(file, history)
}