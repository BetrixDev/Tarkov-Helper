import { Key, KeysCommand } from '../../src/commands/Keys'
import { fetchData, updateData } from '../../src/Cache'

describe('Keys Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return baseMessage', () => {
        const message = KeysCommand.baseMessage('en', 'Customs')

        expect(message.embeds).toBeDefined()
        expect(message.components).toBeDefined()
    })

    it('should return a message for every key', () => {
        const keys = fetchData<{ [key: string]: Key[] }>('mapKeys')

        Object.entries(keys).forEach(([map, arr]) => {
            arr.forEach((key) => {
                const message = KeysCommand.keyMessage(key.id, map, 'en', 0)

                expect(message.embeds).toBeDefined()
                expect(message.components).toBeDefined()
            })
        })
    })
})
