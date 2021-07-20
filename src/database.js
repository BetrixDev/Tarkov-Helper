const serverModel = require('./models/serverSchema')
const fs = require('fs')

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


exports.GetServerData = GetServerData
exports.SetServerData = SetServerData