import { Locales, Trading } from '../../types/game/Locales'
import { fetchData } from '../Cache'

/**Used for grabbing the name of the trader in the correct language */
export class Trader {
    name: string

    constructor(name: string, language: Languages) {
        const traderNames = fetchData<Locales>(language).trading

        const [id] = this.traderObject(name)

        this.name = traderNames[id].Nickname
    }

    private traderObject(name: string) {
        const traderNames = fetchData<Locales>('en').trading

        const traderData = Object.entries(traderNames).find(([id, data]) => data.Nickname === name) as [string, Trading]

        return traderData
    }
}
