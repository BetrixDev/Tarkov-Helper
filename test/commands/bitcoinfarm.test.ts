import { BitcoinFarm, BitcoinFarmCommand } from '../../src/commands/BitcoinFarm'
import { updateData } from '../../src/data/Cache'

describe('Bitcoin Farm Command Test', () => {
    beforeAll(() => {
        updateData()
    })

    it('should calculate the profits for each amount of gpus', () => {
        for (let i = 1; i <= 500; i++) {
            const calculator = new BitcoinFarm(i)

            expect(calculator.bitcoinsPerDay).not.toBeNaN()
        }
    })

    it('should return a message for each amount of gpus', () => {
        for (let i = 1; i <= 50; i++) {
            const message = BitcoinFarmCommand.message('en', i)

            expect(message.embeds).toBeDefined()
        }
    })

    it('should return a message for comparing two gpu amounts', () => {
        for (let i = 1; i <= 50; i++) {
            for (let c = 1; c <= 50; c++) {
                try {
                    const message = BitcoinFarmCommand.message('en', i, c)

                    expect(message.embeds).toBeDefined()
                } catch (e) {
                    expect(e).toEqual(new Error('Please make sure both input fields are not the same'))
                }
            }
        }
    })
})
