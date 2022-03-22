import 'reflect-metadata'
import logger from '../config/logger'
import { serverModel } from '../models/server-model'

const Namespace = 'ServerDatabase'

const defaultData: ServerData = {
    ServerID: '',
    Language: 'en',
    Cooldown: 3,
    ChannelLock: ''
}

export async function queryDatabase(guildId: string): Promise<ServerData> {
    if (guildId === '') return defaultData

    let data
    try {
        data = await serverModel.findOne({ ServerID: guildId })
        if (!data) {
            data = {
                ServerID: guildId,
                AdminRole: '',
                Cooldown: 3,
                ChannelLock: '',
                Language: 'en'
            }

            const server = await serverModel.create(data)
            server.save()
        }
    } catch (e) {
        logger.error(Namespace, 'Error fetching server data', e)
    }
    return data
}

export async function setDatabase(guildId: string | null, key: keyof ServerData, data: any) {
    if (!guildId) { return false }

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
