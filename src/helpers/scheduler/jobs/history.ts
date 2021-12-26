// Logs price history

import { existsSync, mkdirSync } from 'fs'
import { Logger, ReadJson, WriteJson } from '../../../lib'

type History = {
    price: number
    date: number
}

function sortPrices(item: Item) {
    try {
        return item.sellFor.sort((a, b) => {
            return b.price - a.price
        })[0].price
    } catch {
        return 0
    }
}

export const HistoryLogger = async () => {
    Logger('Logging Prices...')

    if (!existsSync('./src/data/pricehistory')) {
        mkdirSync('./src/data/pricehistory')
    }

    const date = Math.floor(Date.now() / 1000) * 1000 // Cleans up number

    let itemData: Item[] = ReadJson('./game_data/api/itemdata.json')

    for (let i = 0; i < itemData.length; i++) {
        const item = itemData[i]

        let oldFile: History[] = []

        if (existsSync(`./game_data/pricehistory/${item.id}.json`)) {
            oldFile = ReadJson(`./game_data/pricehistory/${item.id}.json`)
            oldFile.push({ date: date, price: sortPrices(itemData[i]) })

            if (oldFile.length > 1488) oldFile.shift()
        } else {
            oldFile = [{ date: date, price: sortPrices(itemData[i]) }]
        }

        WriteJson(`./game_data/pricehistory/${item.id}.json`, oldFile)
    }

    Logger('Logged Prices')
}
