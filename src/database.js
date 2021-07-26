const serverModel = require('./models/serverSchema')
const commandCounter = require('./models/commandSchema')

const GetServerData = async(serverid) => {
    let serverData

    try {
        serverData = await serverModel.findOne({ ServerID: serverid })

        if (!serverData) {
            let server = await serverModel.create({
                ServerID: serverid,
                AdminRole: "",
                Cooldown: 3,
                ChannelLock: ""
            })
            server.save()
        }

    } catch (e) {
        console.log(e)
    }
    return serverData
}

const SetServerData = async(serverid, key, data) => {
    await serverModel.findOneAndUpdate({
        ServerID: serverid
    }, {
        $set: {
            [key]: data
        }
    })
}

const IncreaseCommands = async(commandName) => {
    let commandData

    try {
        commandData = await commandCounter.findOne({ name: commandName })

        if (!commandData) {
            let command = await commandCounter.create({
                name: commandName,
                commands: 1
            })
            await command.save()
        } else {
            await commandCounter.findOneAndUpdate({
                name: commandName
            }, {
                $inc: {
                    commands: 1
                }
            })
        }

    } catch (e) {
        console.log(e)
    }
}

exports.IncreaseCommands = IncreaseCommands
exports.GetServerData = GetServerData
exports.SetServerData = SetServerData