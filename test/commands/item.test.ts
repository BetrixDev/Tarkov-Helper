import { TarkovToolsItem } from '../../src/types/game/item'
import { ItemCommand, ErrorMessages } from '../../src/commands/item'
import { fetchData, updateData } from '../../src/data/cache'

describe('Item Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return a message for every item in the game', () => {
        fetchData<TarkovToolsItem[]>('itemData').forEach(({ id, shortName }) => {
            try {
                const message = ItemCommand.message(id, 'en')

                if (message.embeds) {
                    expect(message.embeds[0].title).toEqual(`${shortName} Information`)
                }
            } catch (e) {
                // The only error we expect should be one for auto completion when the item passed in doesn't exists in itemProps
                expect(e).toEqual(new Error(ErrorMessages.USE_AUTO_COMPLETE))
            }
        })
    })
})
