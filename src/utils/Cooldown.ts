// A module for handling user cooldowns across servers
export class CooldownHandler {
    cooldowns: { [key: string]: any }

    constructor() {
        this.cooldowns = {}
        console.log('Init Cooldown Handler')
    }

    SetMessageTime(uid: string) {
        this.cooldowns[uid] = Date.now()
    }

    LastMessage(uid: string): number {
        return this.cooldowns[uid] ?? 1
    }
}
