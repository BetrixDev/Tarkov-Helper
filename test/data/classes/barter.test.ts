import { Barter } from '../../../src/data/classes/Barter'
import { updateData } from '../../../src/data/Cache'

describe('Barter Class Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should grab barters for THICC Item Case', () => {
        const data = new Barter('5c0a840b86f7742ffa4f2482', 'en')

        expect(data.barters.length).toBeGreaterThan(0)
    })

    it('should grab barters for Red Rebel', () => {
        const data = new Barter('5c0126f40db834002a125382', 'en')

        expect(data.barters.length).toBeGreaterThan(0)
    })
})
