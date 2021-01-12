const axios = require('axios');

const GetBitcoinPrice = async() => {
    let getPrice = async() => {
        let response = await axios.get('https://api.coinbase.com/v2/prices/spot?currency=RUB');
        let Price = response.data;
        return Price;
    }
    let PriceValue = await getPrice();
    return PriceValue
}

exports.GetBitcoinPrice = GetBitcoinPrice;