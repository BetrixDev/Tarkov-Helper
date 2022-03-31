import { initEngines, questSearchEngine } from '../../../src/lib/search_engines/QuestEngine'
import { updateData } from '../../../src/Cache'

describe('Quest Search Engine Tests', () => {
    beforeAll(() => {
        updateData()
        initEngines()
    })

    it('should make quest searches in english', () => {
        expect(questSearchEngine('debut', 'en')[0].item.id).toEqual('0')
        expect(questSearchEngine('checking', 'en')[0].item.id).toEqual('1')
        expect(questSearchEngine('eagle eye', 'en')[0].item.id).toEqual('60')
        expect(questSearchEngine('eagleeye', 'en')[0].item.id).toEqual('60')
        expect(questSearchEngine('eagle_eye', 'en')[0].item.id).toEqual('60')
        expect(questSearchEngine('eagle-eye', 'en')[0].item.id).toEqual('60')
    })

    it('should make quest searches in spanish', () => {
        expect(questSearchEngine('debut', 'es')[0].item.id).toEqual('0')
        expect(questSearchEngine('recuerdo', 'es')[0].item.id).toEqual('1')
        expect(questSearchEngine('ojo de halcón', 'es')[0].item.id).toEqual('60')
    })

    // it('should make quest searches in german', () => {
    //     expect(questSearchEngine('debüt', 'ge')[0].item.id).toEqual('0')
    //     expect(questSearchEngine('überprüfung', 'ge')[0].item.id).toEqual('1')
    //     expect(questSearchEngine('adlerauge', 'ge')[0].item.id).toEqual('60')
    // })

    // it('should make quest searches in russian', () => {
    //     expect(questSearchEngine('Проба пера', 'ru')[0].item.id).toEqual('0')
    //     expect(questSearchEngine('Проба', 'ru')[0].item.id).toEqual('0')
    //     expect(questSearchEngine('Проверка на вшивость', 'ru')[0].item.id).toEqual('1')
    //     expect(questSearchEngine('Глаз орла', 'ru')[0].item.id).toEqual('60')

    //     expect(questSearchEngine('Оружейник', 'ru')[0].item.id).not.toEqual('1')
    // })
})
