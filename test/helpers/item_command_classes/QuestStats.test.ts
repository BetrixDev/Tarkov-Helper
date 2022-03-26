import { Item } from '../../../src/lib/game/Item'
import { QuestStats } from '../../../src/helpers/item_command_classes/QuestStats'
import { updateData } from '../../../src/Cache'

describe('QuestStats class tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should retrieve all quests that give roubles as a reward', () => {
        const questData = new QuestStats(new Item('5449016a4bdc2d6f028b456f', 'en'))

        expect(questData.questRewards.length).toBeGreaterThan(0)
    })

    it('should retrieve all quests that give thicc case as a reward', () => {
        const questData = new QuestStats(new Item('5c0a840b86f7742ffa4f2482', 'en'))

        expect(questData.questRewards.length).toBeGreaterThan(0)
    })
})
