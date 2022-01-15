import { isTypeSystemDefinitionNode } from 'graphql'
import { Cache } from '../game-data'

export class QuestStats {
    questRewards: { name: string; count: number }[] = []

    constructor(item: Item) {
        const data: { [key: string]: { QuestName: string; rewards?: { Success: any[] } } } = Cache.rawQuestData

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
}
