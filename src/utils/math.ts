export function Round(num: number, place: string): number {
    return Math.round(num * Number(`1${place}`)) / Number(`1${place}`)
}

export function Random(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min
}

export function Clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max)
}
