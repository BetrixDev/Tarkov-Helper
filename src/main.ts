import 'reflect-metadata'
import { Intents } from 'discord.js'
import { Client, DIService } from 'discordx'
import { container } from 'tsyringe'
import { importx } from '@discordx/importer'
import { connect } from 'mongoose'
import AutoPoster from 'topgg-autoposter'
import dotenv from 'dotenv'
import logger from './config/logger'
import cron from './data/cron'
import { isDev } from './lib'
import { updateData } from './data/cache'
import { initEngines } from './helpers/search_engines/item-engine'

const Namespace = 'Main'

dotenv.config()

DIService.container = container

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
    // If you only want to use global commands only, comment this line
    // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)]
})

client.once('ready', async () => {
    // make sure all guilds are in cache
    await client.guilds.fetch()

    // init all application commands
    await client.initApplicationCommands()

    // init permissions; enabled log to see changes
    await client.initApplicationPermissions()

    // uncomment this line to clear all guild commands,
    // useful when moving to global commands from guild commands
    // await client.clearApplicationCommands(...client.guilds.cache.map((g) => g.id))

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

        await cron()
    } else {
        // Don't download new data to avoid slow startup times on dev enviroments
        updateData().then(() => initEngines())
    }

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
