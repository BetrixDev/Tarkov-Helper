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
                expect(e).toEqual(new Error(ErrorMessages.USE_AUTO_COMPLETE))
            }
        })
    })
})
