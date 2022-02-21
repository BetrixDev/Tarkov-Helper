import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { fetchData, getRawItem } from '../cache'

dayjs.extend(relativeTime)

/**A class to contain all needed data for an item */
export class Item {
    id: string
    name: string
    shortName: string
    private _description: string
    wikiLink: string
    types: ItemType[] = []
    priceData: TarkovToolsItem
    props: RawItemProps

    constructor(id: string, language: Languages) {
        const rawData = fetchData<{ [key: string]: RawItem }>('itemProps')[id]
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

        // Change updated value to relative time
        this.priceData.updated = dayjs(this.priceData.updated).fromNow()
    }

    get description() {
        // Makes the description a quote and shrinks the text if its too long
        return this._description.length > 150 ? `*${this._description.substring(0, 150)}*...` : `*${this._description}*`
    }

    get pricePerSlot() {
        const size = this.priceData.width * this.priceData.height
        return this.priceData.avg24hPrice / size
    }

    private getTypes(i: RawItem) {
        if (i && i._parent !== '') {
            const type = fetchData<{ [key: string]: {} }>('itemTypes')[i._parent] as ItemType
            this.types.push(type)

            this.getTypes(getRawItem(i._parent))
        }
    }
}
