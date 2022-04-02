import { Boss } from '../../../src/lib/game/Boss'
import { updateData } from '../../../src/Cache'

const bosses = ['bossGluhar', 'bossKilla', 'bossBully', 'bossSanitar', 'bossKojaniy', 'bossTagilla']

describe('Boss Class Tests', () => {
    beforeAll(() => {
        updateData()
    })

    bosses.forEach((name) => {
        it(`should grab data for ${name}`, () => {
            const boss = new Boss(name as any, 'en')

            expect(boss.name).toBeDefined()
            expect(boss.hitpoints).toBeDefined()
            expect(boss.attributes.length).toEqual(2)

            if (name !== 'bossTagilla' && name !== 'bossKilla') {
                expect(boss.followersAmount).toBeGreaterThan(0)
            } else {
                expect(boss.followersAmount).toEqual(0)
            }
        })
    })
})
