import { Locales } from '../../types/game/Locales'
import { RawQuest } from '../../types/game/Quest'
import { fetchData } from '../../Cache'
import { Trader } from './Trader'

const Traders = ['Prapor', 'Therapist', 'Fence', 'Peacekeeper', 'Mechanic', 'Skier', 'Jaeger', 'Ragman']

interface GuideImages {
    url: string
    caption?: string
}

interface QuestGuides {
    steps: string[]
    images: GuideImages[]
}

/**A class to contain all needed data for a quest */
export class Quest {
    quest: RawQuest
    questImage?: string
    description: string
    conditions: string[]
    giver: string
    guide: string[]
    guideImages: GuideImages[]
    kappa: string
    wikiLink: string

    constructor(id: number, language: Languages) {
        const quest = fetchData<RawQuest[]>('questData')[id]
        const rawQuest = fetchData<{ [key: string]: any }>('quests')[quest.gameId]
        const locale = fetchData<Locales>(language).quest[quest.gameId]
        const guideData = fetchData<QuestGuides[]>('quest-guides')[id]

        this.guide = guideData.steps
        this.guideImages = guideData.images

        this.kappa = quest.nokappa ? 'No' : 'Yes'
        this.wikiLink = quest.wiki

        this.quest = quest
        this.quest.title = locale.name

        this.giver = new Trader(Traders[quest.giver], language).name

        this.description = `"*${fetchData<Locales>(language).mail[locale.description].toString().slice(0, 150)}...*"`
        this.conditions = Object.values(locale.conditions)
        this.questImage = `https://dev.sp-tarkov.com/SPT-AKI/Server/raw/branch/development/project/assets/images/quests/${rawQuest.image
            .replace('/files/quest/icon/', '')
            .replace('.jpg', '')}.png`
    }
}
