import { readFileSync, PathLike, writeFileSync } from 'fs'
import moment from 'moment-timezone'
require('dotenv').config()

export function GetTime(): string {
    return moment().tz('America/New_York').format('MM/DD h:m:s a').toUpperCase()
}

export function Logger(message: string): void {
    console.log(`{ ${GetTime()} }: ${message}`)
}

export function ReadJson<T>(path: PathLike): T {
    return JSON.parse(readFileSync(path).toString())
}

export function WriteJson(path: PathLike, data: {} | []) {
    return writeFileSync(path, JSON.stringify(data, null, 4))
}

export function isDev() {
    return process.env.NODE_ENV == 'production' ? false : true
}
