class BitcoinFarmCalc {
    constructor(amount) {
        this.BTCPerDay = (1 / ((110000 / (1 + (amount - 1) * 0.044225)) / 3600)) * 24
        this.RUBPerDay = this.BTCPerDay * 650000 // Using 650,000 as a placeholder until I use an actual price API
    }
}

exports.BitcoinFarmCalc = BitcoinFarmCalc