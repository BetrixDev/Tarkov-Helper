import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { fetchData, getRawItem } from '../cache'

dayjs.extend(relativeTime)

/**A class to contain all needed data for an item */
export class Item {
    id: string
    name: string
    shortName: string
    description: string
    wikiLink: string
    types: ItemType[] = []
    priceData: TarkovToolsItem
    props: RawItemProps

    constructor(id: string, language: Languages) {
        const rawData = fetchData<{ [key: string]: RawProps }>('itemProps')[id]
        const locales = fetchData<Locales>(language).templates[id]
        const data = fetchData<TarkovToolsItem[]>('itemData')[fetchData<{ [key: string]: number }>('itemMap')[id]]

        this.getTypes(rawData)

        this.id = id
        this.name = locales?.Name ?? ''
        this.shortName = locales?.ShortName.toString() ?? ''
        this.description = locales?.Description ?? ''
        this.wikiLink = data.wikiLink
        this.priceData = data
        this.props = rawData._props

        // Change updated value to relative time
        this.priceData.updated = dayjs(this.priceData.updated).fromNow()
    }

    get pricePerSlot() {
        const size = this.priceData.width * this.priceData.height
        return this.priceData.avg24hPrice / size
    }

    private getTypes(i: RawProps) {
        if (i && i._parent !== '') {
            const type = fetchData<{ [key: string]: {} }>('itemTypes')[i._parent] as ItemType
            this.types.push(type)

            this.getTypes(getRawItem(i._parent))
        }
    }
}
