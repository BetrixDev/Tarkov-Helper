const Config = require('../config.json')

const GetConfigData = (message) => {
    if (Config.hasOwnProperty(message.guild.id)) {
        // Already data
    } else {
        var NewJsonEntry = Config.Default
        Config[message.guild.id] = NewJsonEntry
    }
    return Config[message.guild.id]
}

exports.GetConfigData = GetConfigData;