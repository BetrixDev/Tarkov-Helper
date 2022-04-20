import { translation } from '../../../src/Lib'

describe('Strings Tests', () => {
    it('should grab translations for selected sentences', () => {
        const t_en = translation('en')
        const t_es = translation('es')

        expect(t_en('abc')).toEqual('abc')

        expect(t_es('Invite Link')).toEqual('Enlace de invitación')
        expect(t_es('Loudness')).toEqual('Volumen')
    })
})
