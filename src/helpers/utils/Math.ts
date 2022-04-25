export const round = (num: number, place: string): number => {
    return Math.round(num * Number(`1${place}`)) / Number(`1${place}`)
}

export const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min)
}

export const clamp = (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max)
}
