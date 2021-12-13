import 'reflect-metadata'
import { Discord, Once } from 'discordx'
import { GetClient, GetDev } from '../../Bot'
import { readFileSync } from 'fs'
import { parse } from 'json5'
import { Logger } from '../../Lib'
import AutoPoster from 'topgg-autoposter'

const config: Config = parse(readFileSync('./data/bot/config.json5').toString())

@Discord()
abstract class Event {
    @Once('ready')
    private async initialized() {
        const client = GetClient()
        await client.clearApplicationCommands()
        await client.initApplicationCommands()
        await client.initApplicationPermissions()

        if (!GetDev()) {
            const poster = AutoPoster(config.TopggToken, GetClient())
            poster.on('posted', (stats) => {
                Logger(`Posted stats to Top.gg | ${stats.serverCount} servers`)
            })
        }

        Logger('Tarkov Helper Initialized')
    }
}
