import { HideoutModule } from '../../../src/lib/game/Module'
import { updateData } from '../../../src/Cache'

describe('Module Class Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should grab data for Bitcoin farm in english', () => {
        const module = new HideoutModule(1, 'en')

        expect(module.name).toEqual('Bitcoin farm')
        expect(module.data).toBeDefined()
    })

    it('should grab data for Vents in english', () => {
        const module = new HideoutModule(41, 'en')

        expect(module.data).toBeDefined()
        expect(module.data.id).toEqual(41)
    })

    it('should grab data for Bitcoin farm in spanish', () => {
        const module = new HideoutModule(35, 'es')

        expect(module.name).toEqual('Campo de Tiro')
        expect(module.data).toBeDefined()
    })
})
