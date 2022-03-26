import { updateData } from '../../../src/data/Cache'
import { Quest } from '../../../src/data/classes/Quest'

describe('Quest class tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should retrieve Debut in english', () => {
        const quest = new Quest(0, 'en')
        expect(quest.quest.title).toEqual('Debut')
    })

    it('should retrieve Debut in spanish', () => {
        const quest = new Quest(0, 'es')
        expect(quest.quest.title).toEqual('El Debut')
    })

    // it('should retrieve Debut in german', () => {
    //     const quest = new Quest(0, 'ge')
    //     expect(quest.quest.title).toEqual('Debüt')
    // })

    // it('should retrieve Debut in russian', () => {
    //     const quest = new Quest(0, 'ru')
    //     expect(quest.quest.title).toEqual('Проба пера')
    // })
})
