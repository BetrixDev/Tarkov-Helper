let fs = require('fs')
let moment = require('moment-timezone')
const { MessageEmbed } = require('discord.js')

globalThis.Logger = (message) => {
    let time = moment().tz('America/New_York').format('h:m:s a').toUpperCase()
    console.log(`{ ${time} }: ${message}`)
}

globalThis.CreateSearchInput = (array, input) => {
    return {
        Type: "Error",
        Content: new MessageEmbed()
            .setTitle('Error!')
            .setThumbnail(Settings.Images.Thumbnails.Search)
            .setColor(Settings.BotSettings['Alt-Color'])
            .setDescription(`Item search of \"${input.toLowerCase().replace('short=','')}\" came back with multiple results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
            .addFields({ name: 'Results', value: array })
    }
}

// Generates Message Embeds in a error format
globalThis.ErrorMessage = (Message, Footer = '') => {
    return new MessageEmbed()
        .setColor(Settings.BotSettings.ErrorColor)
        .setTitle('Error!')
        //.setThumbnail(Settings.Images.Thumbnails.Error)
        .setDescription(Message)
        .setFooter(Footer)
}

globalThis.ErrorMessageField = (Message, Fields, Footer = '') => {
    return new MessageEmbed()
        .setColor(Settings.BotSettings.ErrorColor)
        .setTitle('Error!')
        //.setThumbnail(Settings.Images.Thumbnails.Error)
        .setDescription(Message)
        .addFields(Fields)
        .setFooter(Footer)
}


// Reads JSON files
globalThis.ReadJson = (path) => {
    return JSON.parse(fs.readFileSync(path))
}


// Formats numbers into a price format
globalThis.FormatPrice = (price) => {
    return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'RUB',
            maximumSignificantDigits: 6,
        })
        .format(Number(price))
        .replace('RUB', '₽')
        .replace(' ', '')
}


// Basic settings and configurations for the bot
globalThis.Settings = {
    "BotSettings": {
        "Color": "#15242e",
        "Alt-Color": "#ddcc4c",
        "ErrorColor": "#ff2424"
    },
    "Images": {
        "Logo250": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/Logo250x250.png",
        "SecondBanner": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/SecondBanner3000x1000.png",
        "SlashBanner": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/SlashCommand.png",
        "Author": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/Logo50x50SmallText.png?raw=true",
        "Thumbnails": {
            "Search": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/SearchLogo.png?raw=true",
            "Error": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/ErrorLogo.png?raw=true",
            "Map": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/MapLogo.png?raw=true",
            "BitcoinFarm": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/BitcoinFarmLogo.png?raw=true",
            "Settings": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/SettingsLogo.png?raw=true",
            "Experience": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/ExperienceLogo.png?raw=true",
            "PricePerSlot": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/PricePerSlotLogo.png?raw=true",
            "Question": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/QuestionLogo.png?raw=true",
            "SpawnChance": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/SpawnChance.png?raw=true",
            "ExchangeRate": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/ExchangeLogo.png?raw=true",
            "PriceNotify": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/PriceNotifyLogo.png?raw=true",
            "NotifyRemove": "https://raw.githubusercontent.com/BetrixEdits/Tarkov-Helper/master/src/assets/Media/NotifyRemoveLogo.png?raw=true",
        }
    },
    "Text": {
        "Map": {
            "FooterText": "Map image taken from the EFT WIKI"
        },
        "Stats": {
            "FooterText": "Statistics may be slightly out of date"
        },
        "Experience": {
            "FooterText": "Experience data may be slightly out of date"
        },
        "Quest": {
            "FooterText": "Quest data may be slightly out of date"
        },
        "Caliber": {
            "FooterText": "Ammo data may be slightly out of date"
        },
        "Notify": {
            "FooterText": "Trader icon from wiki"
        },
        "KeyList": {
            "FooterText": "Emote images from the wiki"
        }
    },
    "ItemArrayLink": "https://gist.github.com/BetrixEdits/58aa8d985e4690b9a540467af30ec909",
    "CaliberArrayLink": "https://gist.github.com/BetrixEdits/16c20db88feb4aefd22dbac6e257e290"
}