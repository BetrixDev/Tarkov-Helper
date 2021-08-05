let fs = require('fs')
let moment = require('moment-timezone')
const { MessageEmbed } = require('discord.js')

globalThis.GetTime = () => {
    return moment().tz('America/New_York').format('MM/DD h:m:s a').toUpperCase()
}

globalThis.Logger = (message) => {
    let time = moment().tz('America/New_York').format('h:m:s a').toUpperCase()
    console.log(`{ ${time} }: ${message}`)
}

// Discord.js no longer supports turing arrays and numbers into strings for embed fields 
// (alteast I couldn't find how to anymore) so this function takes care of that
globalThis.ResolveStrings = (fields) => {
    return fields.map(field => {
        let { name, value, inline } = field
        return {
            name: name,
            value: (typeof(value) === 'object') ? value.join('\n') : String(value).toString(),
            inline: (inline ? inline : false)
        }
    })
}

globalThis.CreateSearchInput = (array, input) => {
    return {
        Type: "error",
        Content: new MessageEmbed()
            .setTitle('Error!')
            .setThumbnail(Settings.Images.Thumbnails.Search)
            .setColor(Settings.BotSettings['Alt-Color'])
            .setDescription(`Item search of \"${input.toLowerCase().replace('short=','')}\" came back with multiple results, please be more specific. [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries. \n\n Use the command \`/Confirm\` followed by the number next to the item to complete the search`)
            .addFields(ResolveStrings([{ name: 'Results', value: array }]))
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
        .addFields(ResolveStrings([Fields]))
        .setFooter(Footer)
}


// Reads JSON files
globalThis.ReadJson = (path) => {
    return JSON.parse(fs.readFileSync(path))
}

globalThis.WriteJson = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 4))
}

globalThis.CapitalizeWords = (string) => {
    return string.split(' ').map(word => {
        return word[0].toUpperCase() + word.substr(1)
    }).join(' ')
}

// Formats numbers into a price format
globalThis.FormatPrice = (price, source) => {
    if (source === 'peacekeeper') {
        return new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'USD',
                maximumSignificantDigits: 6,
            })
            .format(Number(price))
    } else {
        return new Intl.NumberFormat('en-EN', {
                style: 'currency',
                currency: 'RUB',
                maximumSignificantDigits: 6,
            })
            .format(Number(price))
            .replace('RUB', '₽')
            .replace(' ', '')
    }
}


// Basic settings and configurations for the bot
globalThis.Settings = require('./bot_data/settings.json')