import 'reflect-metadata'
import NodeCache from 'node-cache'
import { singleton } from 'tsyringe'

type Result = {
    map: string
    helmet: Item
    armor: Item
    gun: Item
}

@singleton()
export class RouletteResults {
    database = new NodeCache({ stdTTL: 300 })

    constructor() {}

    query(date: number) {
        return this.database.get<Result>(date)
    }

    add(date: number, results: Result) {
        this.database.set(date, results)
    }
}
