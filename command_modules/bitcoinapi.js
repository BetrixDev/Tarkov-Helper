const axios = require('axios');

const GetBitcoinPrice = async() => {
    let getPrice = async() => {
        // Using Coinbase API until I get an actual price API for tarkov
        let response = await axios.get('https://api.coinbase.com/v2/prices/spot?currency=RUB');
        let Price = response.data;
        return Price;
    }
    let PriceValue = await getPrice();
    return PriceValue
}

exports.GetBitcoinPrice = GetBitcoinPrice;
