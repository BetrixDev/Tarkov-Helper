import { ExchangeRateCommand } from '../../src/commands/exchangerate'

describe('Exchange Rate Tests', () => {
    it('should return a message for specified amounts', () => {
        const message = ExchangeRateCommand.message('eur', 50000, 'en')

        expect(message.embeds).toBeDefined()
    })

    it('should return a message for specified amounts', () => {
        const message = ExchangeRateCommand.message('rub', 5000000, 'en')

        expect(message.embeds).toBeDefined()
    })

    it('should return a message for specified amounts', () => {
        const message = ExchangeRateCommand.message('usd', 5000, 'en')

        expect(message.embeds).toBeDefined()
    })
})
