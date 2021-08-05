const fs = require('fs')
require('dotenv').config()
const discordjs = require('discord.js')

const client = new discordjs.Client({ intents: [discordjs.Intents.FLAGS.GUILDS] })

const CommandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

client.on('ready', async() => {
    try {
        const commands = await client.application.commands.cache

        commands.forEach(command => {
            command.delete()
        })

        console.log('Finished Deleting')

        for (const File of CommandFiles) {
            let FormatFile = File.split('.')[0]
            let CommandData = require(`../commands/${FormatFile}`).data

            if (CommandData !== undefined) {
                console.log(`Adding ${CommandData.name}`)
                const command = await client.application.commands.create(CommandData)
            }
        }

        console.log('Refreshed commands. You may now close this application and run the bot normally')

    } catch (e) {
        console.log('ERROR REFRESHING COMMANDS')
        console.log('-----------------------------------')
        console.error(e)
    }
})

client.login(process.env.BOT_TOKEN)