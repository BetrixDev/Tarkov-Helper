const fs = require('fs')
require('dotenv').config()
const DiscordJS = require('discord.js')

const client = new DiscordJS.Client()

const getApp = (guildID) => {
    const app = client.api.applications(client.user.id)
    if (guildID) { app.guilds(guildID) }
    return app
}

const BotCommands = new Array()
const CommandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
for (const File of CommandFiles) {
    BotCommands.push(File.split('.')[0])
}

client.on('ready', async() => {
    try {
        const commands = await getApp().commands.get()

        for (const Command of commands) {
            console.log(`Deleting: ${Command.name}`)
            await getApp().commands(Command.id).delete()
        }

        console.log('Finished Deleting')


        for (const File of CommandFiles) {
            let FormatFile = File.split('.')[0]
            let CommandData = require(`../commands/${FormatFile}`)['CommandSettings'].CommandData

            if (CommandData !== undefined) {
                console.log(`Adding ${CommandData.data.name}`)
                await getApp().commands.post(CommandData)
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