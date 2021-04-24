const fs = require('fs')

class PriceInfo {
    constructor(id) {
        this.RawData = JSON.parse(fs.readFileSync('./game_data/pricedata.json'))
        this.ItemID = id
        this.PriceData = this.RawData[id].Item
        this.HighestTraderBuy = this.HighestTrader()
        this.Fee = this.CalcFee()
        this.PricePerSlot = this.PriceSlot()
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
    CalcFee() {
        // Function from tarkov-tools fee calculator script
        let V0 = this.PriceData.basePrice
        let VR = (this.PriceData.avg24hPrice - 1)
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
        return Math.round(this.PriceData.avg24hPrice / Slots)
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


exports.PriceInfo = PriceInfo
exports.GetAllPrices = GetAllPrices