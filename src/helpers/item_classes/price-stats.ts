import { CapitalizeWords, FormatPrice } from '../../lib'

export class PriceData {
    sellFor: ItemPrice[]
    buyFor: ItemPrice[]
    price: number
    size: { width: number; height: number }

    constructor(item: Item) {
        this.price = item.lastLowPrice
        this.sellFor = item.sellFor
        this.buyFor = item.buyFor
        this.size = {
            width: item.width,
            height: item.height
        }
    }
    pricePerSlot() {
        const totalSize = this.size.width * this.size.height

        return Math.floor(this.price / totalSize)
    }
    get sellingPrices() {
        const offers = this.sellFor

        return offers
            .sort((a, b) => {
                return b.price - a.price
            })
            .map((offer) => {
                return {
                    source: CapitalizeWords(offer.source.toString()),
                    price: FormatPrice(offer.price, offer.source.toString())
                }
            })
    }
    get buyingPrices() {
        const offers = this.buyFor

        return offers
            .sort((a, b) => {
                return a.price - b.price
            })
            .map((offer) => {
                return {
                    source: CapitalizeWords(offer.source.toString()),
                    price: FormatPrice(offer.price, offer.source.toString())
                }
            })
    }
}
