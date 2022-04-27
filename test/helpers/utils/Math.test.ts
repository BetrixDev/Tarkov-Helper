import { clamp, random, round } from '../../../src/Lib'

describe('Math Tests', () => {
    it('should round numbers', () => {
        expect(round(99.2, '')).toEqual(99)
        expect(round(100.111, '00')).toEqual(100.11)
        expect(round(0.9, '')).toEqual(1)
    })

    it('should generate a random number', () => {
        for (let i = 0; i < 1000; i++) {
            const rand1 = random(1, 10)
            const rand2 = random(50, 1000)
            const rand3 = random(25, 250)

            expect(rand1 >= 1 && rand1 <= 10).toBeTruthy()
            expect(rand2 >= 50 && rand2 <= 1000).toBeTruthy()
            expect(rand3 >= 25 && rand3 <= 250).toBeTruthy()
        }
    })

    it('should clamp numbers', () => {
        expect(clamp(1, 10, 100)).toEqual(10)
        expect(clamp(5, 1, 100)).toEqual(5)
        expect(clamp(1000, 1, 100)).toEqual(100)
    })
})
