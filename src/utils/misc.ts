import { readFileSync, PathLike, writeFileSync } from 'fs'
import moment from 'moment-timezone'
require('dotenv').config()

export function GetTime(): string {
    return moment().tz('America/New_York').format('MM/DD h:m:s a').toUpperCase()
}

export function Logger(message: string): void {
    console.log(`{ ${GetTime()} }: ${message}`)
}

export function ReadJson<T>(path: PathLike): T {
    return JSON.parse(readFileSync(path).toString())
}

export function WriteJson(path: PathLike, data: {} | []) {
    return writeFileSync(path, JSON.stringify(data, null, 4))
}

export function isDev() {
    return process.env.NODE_ENV == 'production' ? false : true
}

export function LowestPrice(item: Item): ItemPrice {
    if (item.lastLowPrice) {
        return {
            source: 'fleaMarket',
            price: item.lastLowPrice,
            requirements: [
                {
                    type: 'playerLevel',
                    value: 15
                }
            ]
        }
    } else if (item.buyFor.length > 0) {
        return item.buyFor.sort((a, b) => {
            return b.price - a.price
        })[0]
    } else {
        return {
            source: 'fleaMarket',
            price: 0,
            requirements: [
                {
                    type: 'playerLevel',
                    value: 15
                }
            ]
        }
    }
}
