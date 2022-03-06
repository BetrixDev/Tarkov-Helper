import { Location } from '../../../src/data/classes/location'
import { updateData } from '../../../src/data/cache'

const maps = ['woods', 'shoreline', 'labs', 'factory', 'customs', 'reserve', 'lighthouse', 'interchange']

describe('Location Class Tests', () => {
    beforeAll(() => {
        updateData()
    })

    maps.forEach((mapName) => {
        it(`should grab data for ${mapName}`, () => {
            const data = new Location(mapName as Maps, 'en')

            expect(data).toBeDefined()
        })
    })

    maps.forEach((mapName) => {
        it(`should grab data for ${mapName} in russian`, () => {
            const data = new Location(mapName as Maps, 'ru')

            expect(data).toBeDefined()
        })
    })

    maps.forEach((mapName) => {
        it(`should grab data for ${mapName} in spanish`, () => {
            const data = new Location(mapName as Maps, 'es')

            expect(data).toBeDefined()
        })
    })
})
