type Languages = 'en' | 'es' | 'ru' | 'ge'

interface ServerData {
    ServerID: string
    ChannelLock: string
    Cooldown: number
    Language: Languages
}

interface GuardData {
    serverData: ServerData
}
