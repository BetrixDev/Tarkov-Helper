import { readFileSync } from 'jsonfile'
import { HideoutModule } from '../../src/types/game/hideout'
import { updateData } from '../../src/data/cache'
import { HideoutCommand } from '../../src/commands/hideout'

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
