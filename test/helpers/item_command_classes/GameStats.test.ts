import { Item } from '../../../src/lib/game/Item'
import { getItemFields } from '../../../src/helpers/item_command_classes/GameStats'
import { updateData } from '../../../src/Cache'
import { translation } from '../../../src/Lib'

describe('ItemStats class tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should grab all wanted game stats', () => {
        const item = new Item('544a5caa4bdc2d1a388b4568', 'en')
        const item2 = new Item('5c0a840b86f7742ffa4f2482', 'en')

        const t = translation('en')

        expect(getItemFields(item, t).length).toBeGreaterThan(1)
        expect(getItemFields(item2, t).length).toBeGreaterThan(1)
    })
})
