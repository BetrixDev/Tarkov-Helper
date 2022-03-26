import { updateData } from '../../src/data/Cache'
import { XptoCommand } from '../../src/commands/Xpto'

describe('Xpto Command Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should test all possible combinations for a response', async () => {
        for (let current = 0; current <= 79; current++) {
            for (let end = 0; end <= 79; end++) {
                try {
                    const message = await XptoCommand.message(current, end, 'en')

                    if (message.embeds && message.embeds[0].fields) {
                        expect(message.embeds[0].fields[0].name).toEqual(`Experience Gap from ${current} to ${end}`)
                        expect(message.embeds[0].fields[0].value).toBeTruthy()
                    }
                } catch (e) {
                    if (current === end) {
                        expect(e).toEqual('Both level values are the same')
                    }
                }
            }
        }
    })

    it('should give a response using an xp amount and not a level', async () => {
        const message = await XptoCommand.message(1000000, 79, 'en')

        if (message.embeds && message.embeds[0].fields) {
            expect(message.embeds[0].fields[0].name).toEqual(`Experience Gap from 1000000xp to 79`)
            expect(message.embeds[0].fields[0].value).toBeTruthy()
        }
    })
})
