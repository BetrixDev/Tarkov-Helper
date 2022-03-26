import { TarkovToolsItem } from '../../src/types/game/Item'
import { ErrorMessages } from '../../src/commands/Item'
import { PriceCommand } from '../../src/commands/Price'
import { fetchData, updateData } from '../../src/data/Cache'

describe('Price Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return a message for every item in the game', () => {
        fetchData<TarkovToolsItem[]>('itemData').forEach(({ id }) => {
            try {
                const message = PriceCommand.message(id, 'en')

                expect(message.embeds).toBeDefined()
            } catch (e) {
                expect(e).toEqual(new Error(ErrorMessages.USE_AUTO_COMPLETE))
            }
        })
    })
})
