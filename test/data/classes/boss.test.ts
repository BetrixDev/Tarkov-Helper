import { Boss } from '../../../src/data/classes/boss'
import { updateData } from '../../../src/data/cache'

const bosses = ['gluhar', 'killa', 'reshala', 'sanitar', 'shturman', 'tagilla']

describe('Boss Class Tests', () => {
    beforeAll(() => {
        updateData()
    })

    bosses.forEach((name) => {
        it(`should grab data for ${name}`, () => {
            const boss = new Boss(name as BossName, 'en')

            expect(boss.name.toLowerCase()).toEqual(name)
        })
    })
})
