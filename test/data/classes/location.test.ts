import { Location } from '../../../src/data/classes/location'
import { updateData } from '../../../src/data/cache'
import { Maps } from '../../../src/types/maps'

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
        it(`should grab data for ${mapName} in spanish`, () => {
            const data = new Location(mapName as Maps, 'es')

            expect(data).toBeDefined()
        })
    })
})