import { fetchData } from '../cache'

/**Used for grabbing the name of the trader in the correct language */
export class Trader {
    name: string

    constructor(name: string, language: Languages) {
        const traderNames = fetchData<Locales>(language).trading

        const traderData = Object.values(traderNames).find((data) => data.Nickname === name) as Trading

        this.name = traderData.Nickname
    }
}
