import { updateData } from '../../src/data/cache'
import { getCalibers } from '../../src/helpers/caliber-grabber'

describe('Caliber Grabber Test', () => {
    beforeAll(() => {
        updateData()
    })

    it('should grab caliber data', () => {
        const data = getCalibers()

        Object.entries(data).forEach(([k, v]) => {
            expect(typeof k).toEqual('string')
            expect(typeof v).toEqual('string')
        })
    })
})
