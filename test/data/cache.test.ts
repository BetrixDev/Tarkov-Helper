import { fetchData, getBarter, getRawItem, updateData } from '../../src/data/cache'

describe('Cache tests', () => {
    beforeAll(() => {
        updateData()
    })

    it('should retrieve barters for items', () => {
        expect(getBarter('5c0a840b86f7742ffa4f2482').length).toEqual(2)
        expect(getBarter('5c0126f40db834002a125382').length).toEqual(1)
        expect(getBarter('545cdb794bdc2d3a198b456a').length).toEqual(4)
    })

    it('should retrieve raw item data for items', () => {
        expect(getRawItem('544a5caa4bdc2d1a388b4568')._id).toEqual('544a5caa4bdc2d1a388b4568')
        expect(getRawItem('5c0a840b86f7742ffa4f2482')._id).toEqual('5c0a840b86f7742ffa4f2482')
        expect(getRawItem('5449016a4bdc2d6f028b456f')._id).toEqual('5449016a4bdc2d6f028b456f')
    })

    it('should retrieve data using "fetchData"', () => {
        expect(fetchData('ammoData')).toBeDefined()
        expect(fetchData('barterData')).toBeDefined()
        expect(fetchData('customs')).toBeDefined()
        expect(fetchData('en')).toBeDefined()
        expect(fetchData('es')).toBeDefined()
        expect(fetchData('factory')).toBeDefined()
        expect(fetchData('globals')).toBeDefined()
        expect(fetchData('gluhar')).toBeDefined()
        expect(fetchData('hideoutData')).toBeDefined()
        expect(fetchData('interchange')).toBeDefined()
        expect(fetchData('itemData')).toBeDefined()
        expect(fetchData('itemProps')).toBeDefined()
        expect(fetchData('killa')).toBeDefined()
        expect(fetchData('labs')).toBeDefined()
        expect(fetchData('lighthouse')).toBeDefined()
        expect(fetchData('questData')).toBeDefined()
        expect(fetchData('quests')).toBeDefined()
        expect(fetchData('reserve')).toBeDefined()
        expect(fetchData('reshala')).toBeDefined()
        expect(fetchData('sanitar')).toBeDefined()
        expect(fetchData('shoreline')).toBeDefined()
        expect(fetchData('shturman')).toBeDefined()
        expect(fetchData('tagilla')).toBeDefined()
        expect(fetchData('woods')).toBeDefined()

        expect(fetchData('fakeData')).toBeUndefined()
        expect(fetchData('fakefakeData')).toBeUndefined()
    })
})
