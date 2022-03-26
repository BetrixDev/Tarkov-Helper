import { readFileSync } from 'jsonfile'
import { HideoutModule } from '../../src/types/game/Hideout'
import { updateData } from '../../src/Cache'
import { HideoutCommand } from '../../src/commands/Hideout'

const HIDEOUT_DATA = readFileSync('./data/hideoutData.json') as HideoutModule[]

describe('Hideout Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should return a message for every module', () => {
        HIDEOUT_DATA.forEach((module) => {
            const message = HideoutCommand.message(module.id, 'en')

            expect(message.embeds).toBeDefined()
        })

        HIDEOUT_DATA.forEach((module) => {
            const message = HideoutCommand.message(module.id, 'es')

            expect(message.embeds).toBeDefined()
        })
    })
})
