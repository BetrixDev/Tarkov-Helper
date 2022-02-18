import { Item } from '../../../src/data/classes/item'
import { updateData } from '../../../src/data/cache'

describe('Item class tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should retrieve M995 in english', () => {
        const item = new Item('59e690b686f7746c9f75e848', 'en')
        expect(item.name).toEqual('5.56x45mm M995')
    })

    it('should retrieve M995 in spanish', () => {
        const item = new Item('59e690b686f7746c9f75e848', 'es')
        expect(item.name).toEqual('Munición M995 de 5,56x45 mm')
    })

    it('should retrieve M995 in russian', () => {
        const item = new Item('59e690b686f7746c9f75e848', 'ru')
        expect(item.name).toEqual('5.56x45мм M995')
    })

    it('should retrieve M995 in german', () => {
        const item = new Item('59e690b686f7746c9f75e848', 'ge')
        expect(item.name).toEqual('5,56 x 45 mm M995')
    })

    it('should retrieve all item types for a Fast MT (Black)', () => {
        const item = new Item('5a154d5cfcdbcb001a3b00da', 'en')
        expect(item.types).toHaveLength(5)
    })

    it('should retrieve price data for RedRebel', () => {
        const item = new Item('5c0126f40db834002a125382', 'en')
        expect(item.priceData).toBeDefined()
    })
})
