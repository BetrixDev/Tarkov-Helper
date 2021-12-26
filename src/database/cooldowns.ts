import { singleton } from 'tsyringe'

@singleton()
export class CooldownDatabase {
    database: Map<string, number>

    constructor() {
        this.database = new Map()
    }

    query(uid: string) {
        return this.database.get(uid)
    }

    update(uid: string, date: number) {
        this.database.set(uid, date)
    }
}
