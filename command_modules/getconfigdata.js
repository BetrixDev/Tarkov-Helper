/*
// Load modules
const fs = require('fs')

// Load data
let Config = JSON.parse(fs.readFileSync('./config.json'))

const GetConfigData = (message) => {
    if (message.guild !== null) {
        console.log(JSON.parse(fs.readFileSync('./config.json')))
        if (JSON.parse(fs.readFileSync('./config.json')).hasOwnProperty(message.guild.id)) {

            // Already data

        } else {

            // Create new config file
            let UpdateConfig = JSON.parse(fs.readFileSync('./config.json'))
            var NewJsonEntry = UpdateConfig.Default
            UpdateConfig[message.guild.id] = NewJsonEntry

            // Write new data
            fs.writeFileSync('./config.json', JSON.stringify(UpdateConfig, null, 2))

        }

        return Config[message.guild.id]

    }
}

exports.GetConfigData = GetConfigData;
*/