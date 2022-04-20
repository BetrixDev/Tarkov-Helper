import { isDev } from '../../../src/Lib'

describe('Misc Tests', () => {
    it('should grab the current enviroment', () => {
        expect(isDev).toBeFalsy()
    })
})
