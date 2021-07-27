const fs = require('fs')
const serverModel = require('./models/serverSchema')

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

            return {
                ServerID: serverid,
                AdminRole: "",
                Cooldown: 3,
                ChannelLock: ""
            }
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
    let commandData = JSON.parse(fs.readFileSync('./src/bot_data/commands.json'))

    if (commandData[commandName] === undefined) {
        commandData[commandName] = { total: 1 }
    } else {
        commandData[commandName].total++
    }

    fs.writeFileSync('./src/bot_data/commands.json', JSON.stringify(commandData, null, 4))
}

exports.IncreaseCommands = IncreaseCommands
exports.GetServerData = GetServerData
exports.SetServerData = SetServerData