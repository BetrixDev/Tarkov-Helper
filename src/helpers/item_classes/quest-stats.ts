import { fetchData } from '../../data/cache'
import { Item } from '../../data/classes/item'
import { RawQuest } from '../../types/game/quest'

interface GameQuestData {
    [key: string]: { QuestName: string; rewards?: { Success: any[] } }
}

export class QuestStats {
    itemId: string
    questRewards: { name: string; count: number }[] = []

    constructor(item: Item) {
        this.itemId = item.id
        const data = fetchData<GameQuestData>('quests')

        Object.values(data).forEach((quest) => {
            if (quest.rewards) {
                const rewards = quest.rewards

                rewards.Success.forEach((r) => {
                    if (r.items) {
                        const items = r.items as { _id: string; _tpl: string; upd: { StackObjectsCount: number } }[]

                        items.forEach((i) => {
                            if (i._tpl === item.id) {
                                this.questRewards.push({ name: quest.QuestName, count: Number(r.value) })
                            }
                        })
                    }
                })
            }
        })
    }

    getDependents() {
        let quests: { quest: string; count: number }[] = []

        fetchData<RawQuest[]>('questData').forEach((quest) => {
            if (quest.objectives) {
                quest.objectives.forEach((objective) => {
                    if (objective.target === this.itemId) {
                        quests.push({ quest: quest.title, count: objective.number })
                    }
                })
            }
        })

        return quests
    }
}
