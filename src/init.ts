import { existsSync, mkdirSync } from 'fs'
import { rm } from 'fs/promises'
import logger from './config/logger'
import cron from './data/cron'

const Namespace = 'Initialization'

async function init() {
    logger.info(Namespace, 'Downloading required game data')
    if (existsSync('./data/')) await rm('./data/', { recursive: true, force: true })

    mkdirSync('./data')

    await cron()

    logger.info(Namespace, 'Done')
    process.exit(0)
}

init()
