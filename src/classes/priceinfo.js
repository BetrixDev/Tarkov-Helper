require('../utils')

class PriceInfo {
    constructor(id) {
        this.RawData = ReadJson('./src/game_data/api/pricedata.json')
        this.ItemID = id
        this.PriceData = this.RawData[id].Item
        this.PriceChange = this.PriceData.changeLast48h
        this.HighestTraderBuy = this.HighestTrader()
        this.Fee = this.CalcFee()
        this.PricePerSlot = this.PriceSlot()
        this.PriceWithFee = this.PriceData.lastLowPrice - this.Fee
        this.RecommendedSell = this.BestSell()
    }
    HighestTrader() {
        let Traders = this.PriceData.traderPrices
        let Highest = [0, '']

        for (const t in Traders) {
            let Trader = Traders[t]

            if (Trader.price > Highest[0]) {
                Highest = [Trader.price, Trader.trader.name]
            }
        }

        return Highest
    }
    BestSell() {
        if (this.PriceWithFee > this.HighestTrader()[0]) {
            return 'Flea Market'
        } else {
            return this.HighestTrader()[1]
        }
    }
    CalcFee() {
        // Function from tarkov-tools fee calculator script
        // https://github.com/kokarn/tarkov-tools/blob/master/src/modules/flea-market-fee.js
        let V0 = this.PriceData.basePrice
        let VR = this.PriceData.lastLowPrice
        let Ti = 0.05
        let Tr = 0.05
        let P0 = Math.log10(V0 / VR)
        let PR = Math.log10(VR / V0)
        let Q = 1

        if (VR < V0) {
            P0 = Math.pow(P0, 1.08)
        }

        if (VR >= V0) {
            PR = Math.pow(PR, 1.08)
        }

        return Math.ceil(V0 * Ti * Math.pow(4, P0) * Q + VR * Tr * Math.pow(4, PR) * Q)
    }
    PriceSlot() {
        let Slots = this.PriceData.width * this.PriceData.height
        return Math.round(this.PriceData.lastLowPrice / Slots)
    }
    BestBuy() {
        let BuyData = this.PriceData.buyFor

        let LowestBuy = [0, '']

        for (let Trade of BuyData) {
            let NormalizedPrice = Trade.price
            if (Trade.source === 'peacekeeper') {
                NormalizedPrice = Trade.price * 116
            }

            if (LowestBuy[1] === '') {
                LowestBuy[0] = NormalizedPrice
                LowestBuy[1] = Trade.source
            } else if (LowestBuy[0] > NormalizedPrice) {
                LowestBuy[0] = NormalizedPrice
                LowestBuy[1] = Trade.source
            }

        }

        return LowestBuy
    }
}

exports.PriceInfo = PriceInfo