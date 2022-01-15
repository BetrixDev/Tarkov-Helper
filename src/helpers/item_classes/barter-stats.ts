import { EmbedFieldData } from 'discord.js'
import { FormatPrice, GetTime, LowestPrice } from '../../lib'
import { GetBarter, GetItem } from '../game-data'

export class BaterData {
    barters: Barter[]
    item: Item

    constructor(id: string) {
        this.item = GetItem(id)
        this.barters = GetBarter(id).sort((a, b) => {
            let costs = { a: 0, b: 0 }

            a.requiredItems.forEach((i) => {
                const item = GetItem(i.item.id)
                costs['a'] += i.count * LowestPrice(item).price
            })
            b.requiredItems.forEach((i) => {
                const item = GetItem(i.item.id)
                costs['b'] += i.count * LowestPrice(item).price
            })

            return costs['b'] - costs['a']
        })
    }

    get message() {
        let message: EmbedFieldData[] = new Array()

        this.barters.forEach((barter, i) => {
            let barterTotal = 0
            const requiredItems = barter.requiredItems.map((i) => {
                const { count } = i
                const item = GetItem(i.item.id)
                const lowestPrice = LowestPrice(item)

                barterTotal += lowestPrice.price * count
                return `x**${count}** - [${item.shortName}](${item.wikiLink} "${item.name}") - ${FormatPrice(
                    lowestPrice.price * count
                )}`
            })
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
                    value: FormatPrice(this.item.lastLowPrice),
                    inline: true
                },
                {
                    name: 'Barter Total',
                    value: FormatPrice(barterTotal),
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Barter Profit',
                    value: FormatPrice(this.item.lastLowPrice - barterTotal),
                    inline: true
                }
            )
        })

        return message
    }
}
