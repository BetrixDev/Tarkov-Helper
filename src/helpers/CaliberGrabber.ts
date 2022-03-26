import { fetchData } from '../Cache'
import { RawAmmo } from '../types/game/Ammo'

export const getCalibers = () => {
    const data = fetchData<Record<string, RawAmmo>>('ammoData')

    let calibers: Record<string, string> = {}

    for (const id in data) {
        const bullet = data[id]

        calibers[bullet.caliber.replace('Caliber', '')] = bullet.caliber
    }

    return calibers
}
