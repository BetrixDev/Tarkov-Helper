import fuse from 'fuse.js'
import { ReadJson } from '../../lib'

interface EngineParams {
    id: string
    name: string
}

const QuestData = ReadJson<TrackerQuest[]>('game_data/api/questdata.json')
const EngineValues: EngineParams[] = QuestData.map((quest) => {
    return { id: quest.id.toString(), name: quest.title }
})

const Fuse = new fuse(EngineValues, { keys: ['name'] })

export default (input: string) => {
    return Fuse.search<EngineParams>(input).slice(0, 25)
}
