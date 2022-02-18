import { fetchData } from '../cache'

/**A class to contain all needed data for a quest */
export class Quest {
    quest: RawQuest
    questImage?: string
    description: string
    conditions: string[]

    constructor(id: number, language: Languages) {
        const quest = fetchData<RawQuest[]>('questData')[id]
        const rawQuest = fetchData<{ [key: string]: any }>('quests')[quest.gameId]
        const locale = fetchData<Locales>(language).quest[quest.gameId]

        this.quest = quest
        this.quest.title = locale.name

        this.description = fetchData<Locales>(language).mail[locale.description].toString()
        this.conditions = Object.values(locale.conditions)
        this.questImage = `https://dev.sp-tarkov.com/SPT-AKI/Server/raw/branch/development/project/assets/images/quests/${rawQuest.image
            .replace('/files/quest/icon/', '')
            .replace('.jpg', '')}.png`

        delete this.quest.locales
    }
}
