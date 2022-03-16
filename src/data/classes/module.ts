import { readFileSync } from 'jsonfile'
import { Locales } from '../../types/game/locales'
import { fetchData } from '../cache'
import { HideoutModule as RawHideoutModule } from '../../types/game/hideout'
import { Item } from './item'

const EN_LOCALES = (readFileSync('./data/en.json') as Locales).interface
const HIDEOUT_DATA = readFileSync('./data/hideoutData.json') as RawHideoutModule[]

type StringTuple = [string, string]

export class HideoutModule {
    name: string
    level: number
    data: RawHideoutModule

    constructor(moduleId: number, language: Languages) {
        const locales = fetchData<Locales>(language).interface

        const moduleData = HIDEOUT_DATA.find(({ id }) => moduleId === id) as RawHideoutModule

        const [moduleInterfaceId] = Object.entries(EN_LOCALES).find(
            ([id, text]) => text.toLowerCase() === moduleData.name.toLowerCase()
        ) as StringTuple

        const name = locales[moduleInterfaceId]

        this.name = name
        this.level = moduleData.level
        this.data = moduleData
    }

    get upgradeCost(): number {
        return this.data.itemRequirements
            .map(({ item: { id }, count }) => new Item(id, 'en').lowestBuyPrice * count)
            .reduce((cost, i) => cost + i, 0)
    }
}
