import 'reflect-metadata'
import { Intents } from 'discord.js'
import { Client, DIService } from 'discordx'
import { container } from 'tsyringe'
import { importx } from '@discordx/importer'
import { connect } from 'mongoose'
import { existsSync } from 'fs'
import AutoPoster from 'topgg-autoposter'
import dotenv from 'dotenv'
import logger from './config/Logger'
import cron from './data/Cron'
import { isDev } from './Lib'
import { updateData } from './data/Cache'
import { initEngines as initItemEngine } from './helpers/search_engines/ItemEngine'
import { initEngines as initQuestEngine } from './helpers/search_engines/QuestEngine'
import { initEngines as initModuleEngine } from './helpers/search_engines/ModuleEngine'
import { initEngines as initCaliberEngine } from './helpers/search_engines/CaliberEngine'
import { InjectServerData } from './guards/InjectData'
import { RateLimiterGuard } from './guards/RateLimiter'
import { ChannelLockGuard } from './guards/ChannelLock'

const Namespace = 'Main'

dotenv.config()

DIService.container = container

const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
    // If you only want to use global commands only, comment this line
    botGuilds: isDev ? [(client) => client.guilds.cache.map((guild) => guild.id)] : undefined,
    guards: [InjectServerData, ChannelLockGuard, RateLimiterGuard]
})

client.once('ready', async () => {
    // make sure all guilds are in cache
    await client.guilds.fetch()

    // init all application commands
    await client.initApplicationCommands()

    // init permissions; enabled log to see changes
    await client.initApplicationPermissions()

    if (!isDev) {
        // uncomment this line to clear all guild commands,
        // useful when moving to global commands from guild commands
        await client.clearApplicationCommands(...client.guilds.cache.map((g) => g.id))
    }

    logger.info(Namespace, 'Tarkov Helper intialized')
})

async function run() {
    if (process.env.MONGO_URL) {
        await connect(process.env.MONGO_URL).then(() => {
            logger.info(Namespace, 'Connected to MongoDB')
        })
    } else {
        throw new Error('Please specifiy a MongoDB connection url in .env')
    }

    if (!isDev) {
        logger.info(Namespace, 'Running from production enviroment')

        if (process.env.TOPGG_TOKEN) {
            const poster = AutoPoster(process.env.TOPGG_TOKEN, client)
            poster.on('posted', ({ serverCount }) => {
                logger.info(Namespace, `Posted stats to Top.gg | ${serverCount} servers`)
            })
        }

        if (!existsSync('./data/')) await cron()
    }

    // Load data into memory
    await updateData().then(() => {
        // Initialize search engines
        initItemEngine()
        initQuestEngine()
        initModuleEngine()
        initCaliberEngine()
    })

    let botToken = process.env.BOT_TOKEN_DEV

    // Decide wether or not to use dev token or not
    if (!isDev || !botToken) {
        botToken = process.env.BOT_TOKEN
    }

    if (botToken) {
        await importx(__dirname + '/{commands,events}/*.{ts,js}')
        client.login(botToken)
    } else {
        throw new Error('Please set your bot\'s token in the "BOT_TOKEN" field in .env')
    }
}

run()
