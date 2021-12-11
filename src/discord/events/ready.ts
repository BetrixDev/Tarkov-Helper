import 'reflect-metadata'
import { Discord, Once } from 'discordx'
import { GetClient } from '../../Bot'
import { Logger } from '../../Lib'

@Discord()
abstract class Event {
    @Once('ready')
    private async initialized() {
        const client = GetClient()
        await client.initApplicationCommands()
        await client.initApplicationPermissions()

        Logger('Tarkov Helper Initialized')
    }
}
