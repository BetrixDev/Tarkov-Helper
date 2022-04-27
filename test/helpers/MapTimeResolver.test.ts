import { realTimeToTarkovTime } from '../../src/helpers/MapTimeResolver'

describe('Map Time Tests', () => {
    it('should retrieve the time for both sides', () => {
        expect(typeof realTimeToTarkovTime(new Date(), 'left') === 'string').toBeTruthy()
        expect(typeof realTimeToTarkovTime(new Date(), 'right') === 'string').toBeTruthy()
    })
})
