const fs = require('fs')
require('dotenv').config()
const discordjs = require('discord.js')

const client = new discordjs.Client({ intents: [discordjs.Intents.FLAGS.GUILDS] })

const CommandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

client.on('ready', async() => {
    try {

        let commands = new Array()

        for (let command of CommandFiles) {
            let commandData = require(`../commands/${command}`).data

            commands.push(commandData)
        }

        commands.forEach(async command => {
            console.log(`Deleting: ${command.name}`)
            try {
                await client.application.commands.delete(command)
            } catch {}
        })

        console.log('\n')

        await client.application.commands.set(commands)

        console.log('Refreshed commands. You may now close this application and run the bot normally')

    } catch (e) {
        console.log('ERROR REFRESHING COMMANDS')
        console.log('-----------------------------------')
        console.error(e)
    }
})

client.login(process.env.BOT_TOKEN)