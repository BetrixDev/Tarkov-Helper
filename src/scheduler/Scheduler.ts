// A module to schedule intervalled data grabbing from apis

import { ItemGrabber } from './jobs/Items'
import { QuestGrabber } from './jobs/Quests'
import { BarterGrabber } from './jobs/Barter'
import { HistoryLogger } from './jobs/History'
import { scheduleJob } from 'node-schedule'
import { Cache } from '../Lib'

const cache = new Cache()

function ScheduleJobs() {
    // Run functions once to grab initial data

    if (process.env.NODE_ENV == 'production') {
        // Only run these functions in production enviroments
        QuestGrabber()
        ItemGrabber()
        BarterGrabber()
    }

    scheduleJob('*/30 * * * *', async () => {
        // Runs every 30 minutes
        BarterGrabber()
        ItemGrabber()

        setTimeout(() => {
            // Run HistoryLogger after 5 seconds so the ItemGrabber can finish to give up-to-date info
            cache.updateData()
            HistoryLogger()
        }, 5000)
    })

    scheduleJob('0 */3 * * *', async () => {
        // Runs every 3 hours
        QuestGrabber()
    })
}

export { ScheduleJobs }
