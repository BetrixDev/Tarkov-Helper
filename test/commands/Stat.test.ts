import { TarkovToolsItem } from '../../src/types/game/Item'
import { ErrorMessages } from '../../src/commands/Item'
import { StatCommand } from '../../src/commands/Stat'
import { fetchData, updateData } from '../../src/Cache'

describe('Barter Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return a message for every item in the game', () => {
        fetchData<TarkovToolsItem[]>('itemData').forEach(({ id }) => {
            try {
                const message = StatCommand.message(id, 'en')

                expect(message.embeds).toBeDefined()
            } catch (e) {
                expect(e).toEqual(new Error(ErrorMessages.USE_AUTO_COMPLETE))
            }
        })
    })
})
