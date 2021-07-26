require('../utils')

class BarterInfo {
    constructor(Barter) {
        this.PriceData = ReadJson('./src/game_data/api/pricedata.json')
        this.Barter = Barter
    }
    FormattedIngredients() {
        let Ingredients = this.Barter.RequiredItems

        let FormattedIngredients = new Array()

        for (const Ingredient of Ingredients) {
            FormattedIngredients.push(`x**${Ingredient.Amount}** - [${Ingredient.ShortName}](${Ingredient.WikiLink}) - ${FormatPrice(Number(this.PriceData[Ingredient.ID].Item.avg24hPrice) * Number(Ingredient.Amount))}`)
        }

        return FormattedIngredients
    }
    BarterPrice() {
        let Ingredients = this.Barter.RequiredItems

        let Price = 0

        for (const Ingredient of Ingredients) {
            Price = Price + (Number(this.PriceData[Ingredient.ID].Item.avg24hPrice) * Number(Ingredient.Amount))
        }

        return Price
    }
    FleaPrice() {
        let FleaPrice = this.PriceData[this.Barter.Reward.ID].Item.avg24hPrice

        if (FleaPrice === 0) {
            return { Price: 'Non on Flea', NonFormat: FleaPrice }
        } else {
            return { Price: FormatPrice(FleaPrice), NonFormat: FleaPrice }
        }

    }
    BarterProfit() {
        let ItemPrice = Number(this.FleaPrice().NonFormat)

        let BarterPrice = Number(this.BarterPrice())

        if (ItemPrice === 0) {
            return FormatPrice(Math.abs(ItemPrice - BarterPrice))
        } else {
            return FormatPrice(ItemPrice - BarterPrice)
        }
    }
}

exports.BarterInfo = BarterInfo