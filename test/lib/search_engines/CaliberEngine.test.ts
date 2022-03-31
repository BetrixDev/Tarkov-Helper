import { caliberSearchEngine, initEngines } from '../../../src/lib/search_engines/CaliberEngine'
import { updateData } from '../../../src/Cache'

describe('Caliber Search Engine Tests', () => {
    beforeAll(() => {
        updateData()
        initEngines()
    })

    it('should complete searches for calibers', () => {
        expect(caliberSearchEngine('556x45')[0].item.key).toEqual('Caliber556x45NATO')
        expect(caliberSearchEngine('762x39')[0].item.key).toEqual('Caliber762x39')
        expect(caliberSearchEngine('9 18')[0].item.key).toEqual('Caliber9x18PM')
        expect(caliberSearchEngine('9 19')[0].item.key).toEqual('Caliber9x19PARA')
        expect(caliberSearchEngine('57')[0].item.key).toEqual('Caliber57x28')
    })
})
