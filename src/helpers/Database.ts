import { serverModel } from '../utils/models/server'

export const ServerData = async (guildId: string): Promise<ServerData> => {
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

export const SetServerData = async (guild: string, key: keyof ServerData, data: any): Promise<boolean> => {
    try {
        await serverModel.findOneAndUpdate(
            {
                // Server to update
                ServerID: guild
            },
            {
                $set: {
                    [key]: data
                }
            }
        )
        return true
    } catch {
        return false
    }
}
