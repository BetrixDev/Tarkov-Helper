import { Cache } from '../lib'

export function GetCalibers() {
    const bulletData = Cache.bulletData
    let calibers: { [key: string]: string } = {}

    for (const id in bulletData) {
        const bullet = bulletData[id]

        calibers[bullet.caliber.replace('Caliber', '')] = bullet.caliber
    }

    return calibers
}
