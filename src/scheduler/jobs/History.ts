// Logs price history

import { existsSync, mkdirSync, readdirSync } from 'fs'
import { Logger, ReadJson, WriteJson } from '../../Lib'

const dateDir = './data/command/pricehistory'

type History = {
    price: number
    date: number
}

export const HistoryLogger = async () => {
    Logger('Logging Prices...')

    if (!existsSync(dateDir) && existsSync('./data/command/old')) {
        mkdirSync('./data/command/pricehistory')
        GenerateLogs()
        return
    }

    const date = Math.floor(Date.now() / 1000) * 1000 // Cleans up number

    let itemData: Item[] = ReadJson('./data/game/api/itemdata.json')

    for (let i = 0; i < itemData.length; i++) {
        const item = itemData[i]

        let oldFile: History[] = []

        if (existsSync(`./data/command/pricehistory/${item.id}.json`)) {
            oldFile = ReadJson(`./data/command/pricehistory/${item.id}.json`)
            oldFile.push({ date: date, price: itemData[i].lastLowPrice })

            if (oldFile.length > 1488) oldFile.shift()
        } else {
            oldFile = [{ date: date, price: itemData[i].lastLowPrice }]
        }

        WriteJson(`./data/command/pricehistory/${item.id}.json`, oldFile)
    }

    Logger('Logged Prices')
}

const GenerateLogs = () => {
    // Converts old style to new style of logging
    let itemData: Item[] = ReadJson('./data/game/api/itemdata.json')

    const dateFiles = readdirSync('./data/command/old/')
        .filter((file) => file.endsWith('.json'))
        .reverse()
        .map((file) => ReadJson(`./data/command/old/${file}`))

    const SetArray = (item: Item) => {
        let prices: History[] = []

        for (let i = 0; i < 31 + 1; i++) {
            const dateData = dateFiles[i]

            prices.push(...dateData[item.id])
        }

        return prices
            .sort((a, b) => {
                return b.date - a.date
            })
            .slice(0, 1488)
            .reverse()
    }

    for (let i = 0; i < itemData.length; i++) {
        const item = itemData[i]

        WriteJson(`./data/command/pricehistory/${item.id}.json`, SetArray(item))
    }

    Logger('Logged Prices')
}
