import { updateData } from '../../../src/data/Cache'
import { initEngines, moduleSearchEngine } from '../../../src/helpers/search_engines/ModuleEngine'

const searches = ['bitcoin', 'vents', 'filtering', 'unit', 'booze', 'water', 'lavatory', 'lava', 'nutrition']

describe('Module Search Engine Tests', () => {
    beforeAll(() => {
        updateData()
        initEngines()
    })

    it('should complete searches in english', () => {
        searches.forEach((term) => {
            const results = moduleSearchEngine(term, 'en')
            expect(results[0].item.name.toLowerCase().includes(term)).toBeTruthy()
        })
    })

    it('should complete searches in spanish', () => {
        const results = moduleSearchEngine('Ventilación', 'es')
        expect(results[0].item.name.toLowerCase().includes('vent')).toBeTruthy()
    })
})
