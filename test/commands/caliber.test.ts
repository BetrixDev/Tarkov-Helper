import { getCalibers } from '../../src/helpers/CaliberGrabber'
import { updateData } from '../../src/Cache'
import { CaliberCommand } from '../../src/commands/Caliber'

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
