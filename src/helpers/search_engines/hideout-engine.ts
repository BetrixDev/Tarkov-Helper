import fuse from 'fuse.js'
import { Cache } from '../game-data'

interface EngineParams {
    key: string
    name: string
}

const EngineValues: EngineParams[] = Cache.hideoutData.map((module) => {
    return { name: `${module.name} - Level ${module.level}`, key: String(module.id).toString() }
})

const Fuse = new fuse(EngineValues, { keys: ['name'] })

export default (input: string) => {
    return Fuse.search<EngineParams>(input).slice(0, 25)
}
