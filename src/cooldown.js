let Cooldown = {}

const GetCooldown = (uid) => {
    if (Cooldown[uid] !== undefined) {
        let MessageTime = new Date()
        return ((MessageTime.getTime() - Cooldown[uid].LastMessage) * 0.001)
    } else {
        let MessageTime = new Date()
        Cooldown[uid] = { LastMessage: MessageTime.getTime() }
        return 100
    }
}

const SetCooldown = (uid) => {
    let MessageTime = new Date()
    Cooldown[uid] = { LastMessage: MessageTime.getTime() }
}

exports.GetCooldown = GetCooldown
exports.SetCooldown = SetCooldown