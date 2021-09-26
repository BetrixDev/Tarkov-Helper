let fs = require('fs')
let moment = require('moment-timezone')
const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js')

globalThis.GetTime = () => {
    return moment().tz('America/New_York').format('MM/DD h:m:s a').toUpperCase()
}

globalThis.Logger = (message) => {
    console.log(`{ ${GetTime()} }: ${message}`)
}

// Discord.js no longer supports turing arrays and numbers into strings for embed fields 
// (alteast I couldn't find how to anymore) so this function takes care of that
globalThis.ResolveStrings = (fields) => {
    return fields.map(field => {
        let { name, value, inline } = field
        return {
            name: name,
            value: (typeof (value) === 'object') ? value.join('\n') : String(value).toString(),
            inline: (inline ? inline : false)
        }
    })
}

globalThis.Round = (num, place) => {
    return Math.round(num * place) / place
}

globalThis.CreateSearchInput = (array, args, variable, commandName) => {
    const ItemFromName = ReadJson('./src/game_data/api/itemfromname.json')
    const Descriptions = ReadJson('./src/game_data/database/locales/global/en.json').templates

    return {
        Type: "error",
        Content: new MessageEmbed()
            .setTitle('Complete Your Search')
            .setThumbnail(Settings.Images.Thumbnails.Search)
            .setColor(Settings.BotSettings['Alt-Color'])
            .setDescription((variable !== 'barter') ?
                `
                Item search of **${args[variable]}** came back with multiple results.
                [Click here](${Settings.ItemArrayLink}) to see a list of all possible entries.
                Use the dropdown menu below to specify your ${variable}
            ` : `
                The item you searched has multiple barters available.
                Use the dropdown menu below to specify the barter you want
            `),
        Components: [new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setCustomId(`${commandName}__${variable}__${JSON.stringify(args)}`)
                .setMaxValues(1)
                .setMinValues(1)
                .setPlaceholder(`Choose a/an ${variable} to complete search`)
                .addOptions(array.map(entry => {
                    if (variable.includes('item')) {
                        let itemID = ItemFromName[entry]?.ID || entry.id
                        let name = entry
                        if (typeof entry == 'object') { name = entry.Name }
                        return {
                            label: name,
                            value: itemID,
                            description: Descriptions[itemID].Description.substr(0, 75).concat('...')
                        }
                    } else if (variable === 'questname' || variable === 'caliber') {
                        return {
                            label: entry,
                            value: entry
                        }
                    } else if (variable === 'barter') {
                        return {
                            label: entry.split('-')[1],
                            value: entry.split('-')[0]
                        }
                    } else if (variable === 'bullet' || variable === 'armor') {
                        let itemID = entry?.ID || entry?.id
                        return {
                            label: entry.Name,
                            value: itemID,
                            description: Descriptions[itemID].Description.substr(0, 75).concat('...')
                        }
                    }
                })))
        ]
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