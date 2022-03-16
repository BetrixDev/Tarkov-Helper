import { EmbedFieldData } from 'discord.js'
import { capitalizeWords, formatPrice, lowestPrice, translation } from '../../lib'
import { ContainedItem, RawBarter } from '../../types/game/barter'
import { fetchData, getBarter } from '../cache'
import { Item } from './item'

interface BarterItem {
    count: number
    item: Item
}

interface BarterResult {
    source: string
    requiredItems: BarterItem[]
    rewardItems: BarterItem[]
}

export class Barter {
    private _barters: any[]
    private itemId: string
    private language: Languages

    constructor(rewardItem: string, language: Languages) {
        const barters = getBarter(rewardItem)

        this.itemId = rewardItem
        this.language = language
        this._barters = barters

        this._barters.forEach((b: any, index) => {
            this._barters[index].rewardItems = b.rewardItems.map((i: ContainedItem) => {
                return {
                    count: i.count,
                    item: new Item(i.item.id, language)
                }
            })
            this._barters[index].requiredItems = b.requiredItems.map((i: ContainedItem) => {
                return {
                    count: i.count,
                    item: new Item(i.item.id, language)
                }
            })
        })
    }

    get barters(): BarterResult[] {
        const barters = this._barters as BarterResult[]

        return barters.sort((a, b) => {
            let aCost = 0
            let bCost = 0

            a.requiredItems.forEach(({ item, count }) => {
                if (item.priceData.buyFor.length > 0) {
                    const lowestBuy = item.priceData.buyFor.sort((c, d) => d.price - c.price)[0]
                    aCost += lowestBuy.price * count
                }
            })

            b.requiredItems.forEach(({ item, count }) => {
                if (item.priceData.buyFor.length > 0) {
                    const lowestBuy = item.priceData.buyFor.sort((c, d) => d.price - c.price)[0]
                    bCost += lowestBuy.price * count
                }
            })

            return bCost - aCost
        })
    }

    get barterMessage() {
        let message: EmbedFieldData[] = []

        this.barters.forEach((barter, i) => {
            let barterTotal = 0

            const requiredItems = barter.requiredItems.map(({ count, item }) => {
                const itemLowestPrice = lowestPrice(item)

                barterTotal += itemLowestPrice.price * count

                return `x**${count}** - [${item.shortName}](${item.wikiLink} "${item.name}") - ${formatPrice(
                    itemLowestPrice.price * count
                )}`
            })

            const item = new Item(this.itemId, this.language)

            message.push(
                {
                    name: `Barter #${i + 1}`,
                    value: '\u200b',
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: `From: ${barter.source}`,
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Items',
                    value: requiredItems.join('\n'),
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Flea Market Price',
                    value: formatPrice(item.lowestBuyPrice),
                    inline: true
                },
                {
                    name: 'Barter Total',
                    value: formatPrice(barterTotal),
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Barter Profit',
                    value: formatPrice(item.lowestBuyPrice - barterTotal),
                    inline: true
                }
            )
        })

        return message
    }

    /**What barters require the item to complete the barter */
    get barterDependents() {
        const t = translation(this.language)

        const barterData = fetchData<RawBarter[]>('barterData')

        let dependents: { name: string; count: number }[] = []

        barterData.forEach((barter, i) => {
            barter.requiredItems.forEach(({ item, count }) => {
                if (item.id === this.itemId) {
                    dependents.push({
                        name: t(
                            '{0} from {1}',
                            barter.rewardItems[0].item.shortName ?? '',
                            capitalizeWords(barter.source)
                        ),
                        count: count
                    })
                }
            })
        })

        return dependents
    }
}
