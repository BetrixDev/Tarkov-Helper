// A module to invoke jobs to run to initially grab all needed data files

import { ItemGrabber } from './jobs/items'
import { QuestGrabber } from './jobs/quests'
import { BarterGrabber } from './jobs/barter'
import { HideoutGrabber } from './jobs/hideout'

async function init() {
    ItemGrabber()
    QuestGrabber()
    BarterGrabber()
    HideoutGrabber()
}

init()
