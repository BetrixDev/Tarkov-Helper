// A module to invoke jobs to run to initially grab all needed data files

import { ItemGrabber } from './jobs/Items'
import { QuestGrabber } from './jobs/Quests'
import { BarterGrabber } from './jobs/Barter'

async function init() {
    ItemGrabber()
    QuestGrabber()
    BarterGrabber()
}

init()
