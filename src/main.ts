import 'reflect-metadata'
import { Intents, Interaction } from 'discord.js'
import { Client, DIService } from 'discordx'
import { container } from 'tsyringe'
import { importx } from '@discordx/importer'
import { isDev, Logger, ReadJson } from './utils/misc'
import { connect } from 'mongoose'
import AutoPoster from 'topgg-autoposter'
import { ScheduleJobs } from './helpers/scheduler/scheduler'

const Config = ReadJson<Config>('config.json')

DIService.container = container

export const client = new Client({
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

    console.log('Tarkov Helper Started')
})

async function run() {
    await connect(Config.bot.monogoUrl).then(() => {
        Logger('Connected to MongoDB database')
    })

    if (!isDev()) {
        Logger('Running from production enviroment')

        const poster = AutoPoster(Config.bot.topggToken, client)
        poster.on('posted', (stats) => {
            Logger(`Posted stats to Top.gg | ${stats.serverCount} servers`)
        })

        ScheduleJobs()
    }

    await importx(__dirname + '/{commands,events}/*.{ts,js}')
    client.login(isDev() ? Config.bot.devToken : Config.bot.token)
}

run()
