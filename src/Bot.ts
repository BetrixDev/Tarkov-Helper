import 'reflect-metadata'
import { Intents } from 'discord.js'
import { Client } from 'discordx'
import { readFileSync } from 'fs'
import { parse } from 'json5'
import { connect } from 'mongoose'
import { Logger } from './Lib'
import { ScheduleJobs } from './scheduler/Scheduler'
require('dotenv').config()

const config: Config = parse(readFileSync('./src/data/bot/config.json5').toString())

export class Main {
    private static _client: Client

    static get Client(): Client {
        return this._client
    }

    static get Dev() {
        return process.env.NODE_ENV == 'production' ? false : true
    }

    static async start(): Promise<void> {
        ScheduleJobs()
        await connect(config?.MongoURL ?? '').then(() => {
            Logger('Connected to MongoDB database')
        })

        this._client = new Client({
            botGuilds: config.DevServerIDs,
            classes: [`${__dirname}/discord/**/*.{js,ts}`, `${__dirname}/discord/commands/*.{js,ts}`],
            intents: [Intents.FLAGS.GUILDS],
            silent: true
        })

        await this._client.login(this.Dev ? config.BotDevToken ?? '' : config.BotToken)
    }
}

Main.start()
export const GetClient = () => Main.Client
export const GetDev = () => Main.Dev
