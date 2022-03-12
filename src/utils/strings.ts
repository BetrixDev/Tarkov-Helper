import { readFileSync } from 'jsonfile'

export type TranslationFunction = (translationKey: string, ...args: Array<string | number>) => string

export const translation = (language: Languages | string): TranslationFunction => {
    const translations: { [key: string]: string } = readFileSync('localizations.json')[language]

    return (str: string, ...args: Array<string | number>) => {
        let text = str
        if (translations && translations[str]) text = translations[str]

        if (args)
            args.forEach((arg, i) => {
                text = text.replaceAll(`{${i}}`, arg.toString())
            })

        return text
    }
}

export function capitalizeWords(string: string) {
    return string
        .split(' ')
        .map((word) => {
            return word[0].toUpperCase() + word.substring(1)
        })
        .join(' ')
}

export function formatNumber(num: number): string {
    return String(num)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatPrice(price: number | string, source?: string) {
    if (source === 'peacekeeper' || source === 'Peacekeeper') {
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

// Thanks Tarkov-Tools :)
export function getItemImage(id: string): string {
    return `https://assets.tarkov-tools.com/${id}-base-image.png`
}

export const DATABASE_LOCATION = process.env.DATABASE_URL as string
