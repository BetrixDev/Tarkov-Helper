// Load modules
const fs = require('fs')

// Load command_modules
const { ErrorMessage } = require('../command_modules/errormessage')

// Load data
let NotifyData = JSON.parse(fs.readFileSync('./notifylist.json'))
const Settings = require('../settings.json')


module.exports = {
    name: 'notify',
    description: "",
    execute(message, args, Discord) {
        let UserID = message.author.id
        let Trader = args[0].toLowerCase()

        if (Trader === "remove" && NotifyData.hasOwnProperty(args[1])) {
            let NewData = NotifyData
            let UserIDPos = NewData[args[1]].indexOf(UserID)

            if (UserIDPos > -1) {
                NewData[args[1]].splice(UserIDPos, 1)
            }

            fs.writeFileSync('./notifylist.json', JSON.stringify(NewData, null, 2))
            SendMessage(`Removed UID from notify list of ${args[1]}`, message)
        } else if (NotifyData.hasOwnProperty(Trader)) {
            let NewData = NotifyData
            NewData[Trader].push(UserID)

            fs.writeFileSync('./notifylist.json', JSON.stringify(NewData, null, 2))
            SendMessage(`Added UID To notify list of ${Trader}`, message)
        } else {
            ErrorMessage("Trader name invalid", message, { name: "Possible Names:", value: [' Prapor', 'Therapist', 'Skier', 'Ragman', 'Mechanic', 'Peacekeeper', 'Jeager'] })
        }
    }
}

function SendMessage(Title, message) {
    const EmbededMessage = {
        color: Settings.BotSettings.Color,
        title: Title,
        thumbnail: {
            url: Settings.Images.Thumbnails.Settings
        }
    }
    message.channel.send({ embed: EmbededMessage })
}