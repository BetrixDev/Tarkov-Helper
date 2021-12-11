import { EmbedFieldData } from 'discord.js'

export const Insert = (str: string, add: string, position: number) => {
    return [str.slice(0, position), add, str.slice(position)].join('')
}

export const Slice = (str: string, pos: number) => {
    return str.slice(0, pos) + str.slice(pos + 1)
}

export function ItemImage(id: string) {
    return `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/item_icons/${id}.png`
}

export function BossImage(boss: string) {
    return `https://raw.githubusercontent.com/Tarkov-Helper/Image-Database/main/boss_images/${boss}.png`
}

export function FormatPrice(price: number | string, source?: string) {
    if (source == 'peacekeeper' || source == 'Peacekeeper') {
        return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'USD',
            maximumSignificantDigits: 6
        }).format(Number(price))
    } else {
        return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'RUB',
            maximumSignificantDigits: 6
        })
            .format(Number(price))
            .replace('RUB', '₽')
            .replace(' ', '')
    }
}

export function FormatNumber(num: number): string {
    return String(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function CapitalizeWords(string: string) {
    return string
        .split(' ')
        .map((word) => {
            return word[0].toUpperCase() + word.substring(1)
        })
        .join(' ')
}

export function ResolveStrings(fields: {}[]): EmbedFieldData[] {
    return fields.map((field: any) => {
        let { name, value, inline } = field
        return {
            name: name,
            value: typeof value === 'object' ? value.join('\n') : String(value).toString(),
            inline: inline != undefined ? inline : false
        }
    })
}
