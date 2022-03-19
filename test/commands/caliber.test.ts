import { getCalibers } from '../../src/helpers/caliber-grabber'
import { updateData } from '../../src/data/cache'
import { CaliberCommand } from '../../src/commands/caliber'

describe('Caliber Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return a message for every caliber in the game', () => {
        Object.values(getCalibers()).forEach((caliber) => {
            expect(CaliberCommand.message(caliber, 'en').embeds).toBeDefined()
        })
    })
})
