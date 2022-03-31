import { BallisticsCalculator } from '../../../src/lib/simulator/Ballistics'
import { updateData } from '../../../src/Cache'
import { Item } from '../../../src/lib/game/Item'

// Testing values are from Battle Buddy
// https://github.com/VeritasDev/BattleBuddy

describe('Ballistics Simulator Tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should calculate the pen chance of Korund vs M855A1', () => {
        const calculator = new BallisticsCalculator(
            new Item('5f5f41476bdad616ad46d631', 'en'),
            new Item('54527ac44bdc2d36668b4567', 'en')
        )

        expect(calculator.currentChance).toBeGreaterThan(36)
        calculator.damageArmor(true)
        expect(calculator.currentChance).toBeGreaterThan(61)
        calculator.damageArmor(true)
        expect(calculator.currentChance).toBeGreaterThan(92)
        calculator.damageArmor(true)
        expect(calculator.currentChance).toBeGreaterThan(96)
    })

    it('should calculate the pen chance of Slick vs 9mm RIP', () => {
        const calculator = new BallisticsCalculator(
            new Item('6038b4b292ec1c3103795a0b', 'en'),
            new Item('5c0d56a986f774449d5de529', 'en')
        )

        expect(calculator.currentChance).toBeLessThan(1)
    })

    it('should return a stringified version of the data', () => {
        const calculator = new BallisticsCalculator(
            new Item('6038b4b292ec1c3103795a0b', 'en'),
            new Item('5c0d56a986f774449d5de529', 'en')
        )

        expect(calculator.stringifiedData).toEqual(`6038b4b292ec1c3103795a0b|5c0d56a986f774449d5de529|80`)
    })
})
