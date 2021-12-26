import fuse from 'fuse.js'
import { GetCalibers } from '../caliber-grabber'

interface EngineParams {
    key: string
    name: string
}

const Calibers = GetCalibers()
const EngineValues: EngineParams[] = Object.keys(Calibers).map((caliber, i) => {
    return { key: Calibers[caliber], name: caliber }
})

const Fuse = new fuse(EngineValues, { keys: ['name'] })

export default (input: string) => {
    return Fuse.search<EngineParams>(input).slice(0, 25)
}
