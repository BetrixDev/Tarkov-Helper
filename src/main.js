// Discord Slash Command code setup from Worn Off Keys https://www.youtube.com/channel/UChPrh75CmPP9Ig6jISPnfNA
// Tarkov Data API from Tarkov Tools https://tarkov-tools.com/about/
// Some code snippets are also from Tarkov Tools
let Start = new Date()

const { GetCooldown, SetCooldown } = require('./cooldown')
const { GetServerData } = require('./command_modules/serverdata')
const DiscordJS = require('discord.js')

const fs = require('fs')
require('dotenv').config()

const guildID = '797601083589001227'
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
    let End = new Date()
    console.log(`Tarkov Helper Initialized in ${End.getTime() - Start.getTime()}ms`)

    //await getApp(guildID).commands('836632502470180894').delete()

    const commands = await getApp(guildID).commands.get()

    let FormattedCommands = {}
    for (const c in commands) {
        let Command = commands[c]
        FormattedCommands[Command.name] = {
            ID: Command.id
        }
    }

    //console.log(commands)

    for (const File of CommandFiles) {
        let FormatFile = File.split('.')[0]
        let CommandData = require(`./commands/${FormatFile}`)['CommandSettings']

        if (!FormattedCommands.hasOwnProperty(FormatFile)) {
            await getApp(guildID).commands.post(CommandData)
        }
    }

    client.ws.on('INTERACTION_CREATE', async(interaction) => {
        const uid = interaction.member.user.id
        let Cooldown = GetServerData(interaction.guild_id)['Cooldown']
        let LastMessage = GetCooldown(uid)
        if (LastMessage > Cooldown || interaction.member.roles.includes(GetServerData(interaction.guild_id)['AdminRole'])) { // Admins bypass cooldowns
            SetCooldown(uid)
            const { name, options } = interaction.data
            const command = name.toLowerCase()
            const args = {}

            if (options) {
                for (const option of options) {
                    const { name, value } = option
                    args[name] = value
                }
            }
            // If command exists locally
            if (BotCommands.includes(command)) {
                const guild = client.guilds.resolve(interaction.guild_id) // Needed for admin commands
                const message = await require(`./commands/${command}`)['CommandFunction'](args, interaction, guild)
                Reply(interaction, message)
            } else {
                Reply(interaction, 'This command has no logic yet')
            }
        } else {
            Reply(interaction, `Cooldown: Please wait ${Cooldown - (Math.round(LastMessage * 100) / 100)} seconds`)
        }
    })
})

const Reply = async(interaction, response) => {
    let data = {
        content: response
    }
    if (typeof response === 'object') {
        data = await CreateAPIMessage(interaction, response)
    }
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data
        }
    })
}

const CreateAPIMessage = async(interaction, content) => {
    const { data, files } = await DiscordJS.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content
        )
        .resolveData()
        .resolveFiles()

    return {...data, files }
}

const StartBot = async() => {
    const { StartTasks } = require('./tasks')
    StartTasks()

    client.login(process.env.BOT_TOKEN)
}
StartBot()