import 'reflect-metadata'
import { singleton } from 'tsyringe'

// Tarkov ids are too long to store within the customId field for message buttons
// So we use this to store the data for 1 minute at a time

export interface IRouletteData {
    gun: string
    armor: string
    helmet: string
    map: string
}

@singleton()
export class RouletteData {
    private data = new Map<string, IRouletteData>()

    fetchData(uid: string): IRouletteData | undefined {
        return this.data.get(uid)
    }

    setData(uid: string, data: IRouletteData) {
        this.data.set(uid, data)

        setTimeout(() => {
            this.data.delete(uid)
        }, 1 * 60 * 1000)
    }
}
