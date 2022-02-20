import { updateData } from '../../../src/data/cache'
import { initEngines, itemSearchEngine } from '../../../src/helpers/search_engines/item-engine'

describe('Item search engine tests', () => {
    beforeAll(() => {
        updateData()
        initEngines()
    })

    it('should complete a search for M995 in english', () => {
        const results = itemSearchEngine('m995', 'en')
        expect(results[0].item.id).toEqual('59e690b686f7746c9f75e848')
    })

    it('should search for only armors with the input of slick', () => {
        const results = itemSearchEngine('slick', 'en', { types: ['Armor'] })
        let passed = true
        results.forEach((r) => {
            if (!r.item.types.includes('Armor')) passed = false
        })
        expect(passed).toBeTruthy()
    })

    it('should complete a search for M995 in spanish', () => {
        const results = itemSearchEngine('m995', 'es')
        expect(results[0].item.id).toEqual('59e690b686f7746c9f75e848')
    })

    it('should complete a search for M995 in russian', () => {
        const results = itemSearchEngine('m995', 'ru')
        expect(results[0].item.id).toEqual('59e690b686f7746c9f75e848')
    })

    it('should complete a search for M995 in german', () => {
        const results = itemSearchEngine('m995', 'ge')
        expect(results[0].item.id).toEqual('59e690b686f7746c9f75e848')
    })

    it('should complete a search for RedRebel in russian', () => {
        const results = itemSearchEngine('Ледоруб Red Rebel', 'ru')
        expect(results[0].item.id).toEqual('5c0126f40db834002a125382')
    })

    it('should complete a search for Mosin Rifle 7.62x54R sawn-off 200mm barrel in russian', () => {
        const results = itemSearchEngine('Обрез ствола 200мм для', 'ru')
        expect(results[0].item.id).toEqual('5bfd4cc90db834001d23e846')
    })
})
