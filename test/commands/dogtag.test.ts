import { updateData } from '../../src/data/cache'
import { MAX_LEVEL, DogtagCommand } from '../../src/commands/dogtag'

describe('Dogtag Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should run the command using all possible combinations', async () => {
        for (let level = 1; level <= MAX_LEVEL; level++) {
            const message = await DogtagCommand.message(level, 'en')

            if (message.embeds) {
                expect(message.embeds[0].title).toEqual('Dogtag Price')
            }
        }
    })

    it('should error with a greater level than expected', async () => {
        try {
            await DogtagCommand.message(MAX_LEVEL + 10, 'en')
        } catch (e) {
            expect(e).toEqual('Please enter a valid level between 1 and 79')
        }
    })

    it('should error with a lesser level than expected', async () => {
        try {
            await DogtagCommand.message(1 - 10, 'en')
        } catch (e) {
            expect(e).toEqual('Please enter a valid level between 1 and 79')
        }
    })
})
