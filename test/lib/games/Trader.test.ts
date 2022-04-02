import { Trader } from '../../../src/lib/game/Trader'
import { updateData } from '../../../src/Cache'

const traders = ['Prapor', 'Therapist', 'Skier', 'Mechanic', 'Fence', 'Peacekeeper', 'Jaeger', 'Ragman']

describe('Trader Class Tests', () => {
    beforeAll(() => {
        updateData()
    })

    traders.forEach((name) => {
        it(`should grab the data for ${name}`, () => {
            const data = new Trader(name, 'en')

            expect(data.name).toEqual(name)
        })
    })

    traders.forEach((name) => {
        it(`should grab the data for ${name} in spanish`, () => {
            const data = new Trader(name, 'es')

            expect(data.name).toBeDefined()
        })
    })

    // traders.forEach((name) => {
    //     it(`should grab the data for ${name} in russian`, () => {
    //         const data = new Trader(name, 'ru')

    //         expect(data.name).toBeDefined()
    //     })
    // })
})
