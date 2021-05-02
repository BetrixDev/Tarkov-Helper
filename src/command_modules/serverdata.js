const fs = require('fs')

const GetServerData = (serverid) => {
    let Config = JSON.parse(fs.readFileSync('./src/bot_data/config.json'))
    if (Config[serverid] === undefined) {
        Config[serverid] = {
            AdminRole: 0,
            Cooldown: 3
        }
    }
    fs.writeFileSync('./src/bot_data/config.json', JSON.stringify(Config, null, 2))
    return Config[serverid]
}

const SetServerData = (serverid, key, data) => {
    let Config = JSON.parse(fs.readFileSync('./src/bot_data/config.json'))
    Config[serverid][key] = data
    fs.writeFileSync('./src/bot_data/config.json', JSON.stringify(Config, null, 2))
}


exports.GetServerData = GetServerData
exports.SetServerData = SetServerData