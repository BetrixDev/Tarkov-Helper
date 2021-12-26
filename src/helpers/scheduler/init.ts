// A module to invoke jobs to run to initially grab all needed data files

import { ItemGrabber } from './jobs/items'
import { QuestGrabber } from './jobs/quests'
import { BarterGrabber } from './jobs/barter'

async function init() {
    ItemGrabber()
    QuestGrabber()
    BarterGrabber()
}

init()
