type Languages = 'en' | 'es'

interface ServerData {
    ServerID: string
    ChannelLock: string
    Cooldown: number
    Language: Languages
}

interface GuardData {
    serverData: ServerData
}
