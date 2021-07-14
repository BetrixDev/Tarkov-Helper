module.exports = (price) => {
    return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'RUB',
        maximumSignificantDigits: 6,
    }).format(Number(price))
};