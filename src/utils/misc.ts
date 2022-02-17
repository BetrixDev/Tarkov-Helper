import { Item } from '../data/classes/item'

export const lowestPrice = (item: Item): ItemPrice => {
    if (item.priceData.lastLowPrice !== 0) {
        return {
            source: 'fleaMarket',
            price: item.priceData.lastLowPrice,
            requirements: [{ type: 'playerLevel', value: 15 }]
        }
    } else if (item.priceData.buyFor.length > 0) {
        return item.priceData.buyFor.sort((a, b) => {
            return b.price - a.price
        })[0]
    } else {
        return {
            source: 'fleaMarket',
            price: 0,
            requirements: [{ type: 'playerLevel', value: 15 }]
        }
    }
}

export const isDev: boolean = process.env.NODE_ENV === 'dev'
