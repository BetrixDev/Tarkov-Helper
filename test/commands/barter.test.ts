import { TarkovToolsItem } from '../../src/types/game/Item'
import { ErrorMessages } from '../../src/commands/Item'
import { BarterCommand } from '../../src/commands/Barter'
import { fetchData, updateData } from '../../src/data/Cache'

describe('Barter Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return a message for every item in the game', () => {
        fetchData<TarkovToolsItem[]>('itemData').forEach(({ id }) => {
            try {
                const message = BarterCommand.message(id, 'en')

                expect(message.embeds).toBeDefined()
            } catch (e) {
                expect(e).toEqual(new Error(ErrorMessages.USE_AUTO_COMPLETE))
            }
        })
    })
})
