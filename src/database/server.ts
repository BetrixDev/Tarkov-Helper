import 'reflect-metadata'
import { serverModel } from '../models/server-model'
import { singleton } from 'tsyringe'
import { Interaction } from 'discord.js'

@singleton()
export class ServerDatabase {
    constructor() {}

    async query(guildId: string): Promise<ServerData> {
        let data
        try {
            data = await serverModel.findOne({ ServerID: guildId })
            if (!data) {
                data = {
                    ServerID: guildId,
                    AdminRole: '',
                    Cooldown: 3,
                    ChannelLock: ''
                }

                const server = await serverModel.create(data)
                server.save()
            }
        } catch (e) {
            console.log(e)
        }
        return data
    }

    async set(guildId: string | null, key: keyof ServerData, data: any) {
        try {
            await serverModel.findOneAndUpdate(
                {
                    ServerID: guildId ?? ''
                },
                {
                    $set: {
                        [key]: data
                    }
                }
            )
            return true
        } catch (e) {
            return false
        }
    }
}
