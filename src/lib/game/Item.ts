import { fetchData, getRawItem } from '../../Cache'
import { Locales } from '../../types/game/Locales'
import { ItemPrice, ItemType, RawItem, RawItemProps, TarkovToolsItem, TraderName } from '../../types/game/Item'

/**A class to contain all needed data for an item */
export class Item {
    id: string
    name: string
    wikiLink: string
    shortName: string
    props: RawItemProps
    types: ItemType[] = []
    priceData: TarkovToolsItem
    private _description: string

    constructor(id: string, language: Languages) {
        const rawData = fetchData<Record<string, RawItem>>('itemProps')[id]
        const locales = fetchData<Locales>(language).templates[id]
        const data = fetchData<TarkovToolsItem[]>('itemData')[fetchData<{ [key: string]: number }>('itemMap')[id]]

        this.getTypes(rawData)

        this.id = id
        this.name = locales?.Name ?? ''
        this.shortName = locales?.ShortName.toString() ?? ''
        this._description = locales?.Description ?? ''
        this.wikiLink = data.wikiLink
        this.priceData = data
        this.props = rawData._props
    }

    static getLocales(id: string, language: Languages) {
        const locales = fetchData<Locales>(language).templates[id]

        return {
            name: String(locales.Name),
            shortName: String(locales.ShortName)
        }
    }

    get description() {
        // Makes the description a quote and shrinks the text if its too long
        return this._description.length > 150 ? `*${this._description.substring(0, 150)}*...` : `*${this._description}*`
    }

    get pricePerSlot() {
        return this.priceData.avg24hPrice / (this.priceData.width * this.priceData.height)
    }

    get iconURL() {
        return `https://assets.tarkov-tools.com/${this.id}-base-image.png`
    }

    get keyData() {
        if (this.types.includes('Key')) {
            const lootData = fetchData<{ [key: string]: string[] | undefined }>('keys')

            return lootData[this.id]
        } else {
            return undefined
        }
    }

    /**Sorted least to greatest */
    buyingPrice(index = 0): ItemPrice | undefined {
        if (this.id === '5449016a4bdc2d6f028b456f') {
            // We say roubles have a buy value of 1 since although they can't be bought, we need them to have a value
            return {
                price: 1,
                // Arbitrary trader name
                source: TraderName.Fence,
                requirements: []
            }
        }

        return this.priceData.buyFor.sort((a, b) => b.price - a.price)[index]
    }

    /**Sorted greatest to least */
    sellingPrice(index = 0): ItemPrice | undefined {
        return this.priceData.sellFor.sort((a, b) => a.price - b.price)[index]
    }

    private getTypes(i: RawItem) {
        if (i && i._parent !== '') {
            const type = fetchData<{ [key: string]: {} }>('itemTypes')[i._parent] as ItemType
            this.types.push(type)

            this.getTypes(getRawItem(i._parent))
        }
    }
}
