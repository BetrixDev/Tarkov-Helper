import { PricePerSlotCommand } from '../../src/commands/PricePerSlot'
import { updateData } from '../../src/Cache'

describe('PricePerSlot Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return a message for specified ranges', () => {
        const message = PricePerSlotCommand.message(
            PricePerSlotCommand.getValidItems(100000, 1000000),
            'en',
            0,
            100000,
            1000000
        )

        expect(message.embeds).toBeDefined()

        const message2 = PricePerSlotCommand.message(
            PricePerSlotCommand.getValidItems(100000, 1000000),
            'en',
            0,
            250000,
            5000000
        )

        expect(message2.embeds).toBeDefined()
    })
})
