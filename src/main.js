// Discord Slash Command code setup from Worn Off Keys https://www.youtube.com/channel/UChPrh75CmPP9Ig6jISPnfNA
// Tarkov Data API from Tarkov Tools https://tarkov-tools.com/about/
// Some code snippets are also from Tarkov Tools
let Start = new Date()

const { GetCooldown, SetCooldown } = require('./cooldown')
const { GetServerData } = require('./command_modules/serverdata')
const { MessageUser } = require('./command_modules/messageuser')
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
    fs.writeFileSync('./dev/client.json', JSON.stringify(client, null, 4)) // Debug
    let End = new Date()
    console.log(`Tarkov Helper Initialized in ${End.getTime() - Start.getTime()}ms`)

    const commands = await getApp(guildID).commands.get()
    fs.writeFileSync('./dev/commands.json', JSON.stringify(commands, null, 4)) // Debug

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

        if (!FormattedCommands.hasOwnProperty(FormatFile) && CommandData !== undefined) {
            await getApp(guildID).commands.post(CommandData)
        }
    }

    client.ws.on('INTERACTION_CREATE', async(interaction) => {
        try { // Try block so we can ignore interactions without erroring the bot
            let IsAdmin = interaction.member.roles.includes(GetServerData(interaction.guild_id)['AdminRole']) // Admins can bypass restrictions

            let ChannelLock = GetServerData(interaction.guild_id)['ChannelLock']
            if (ChannelLock === interaction.channel_id || ChannelLock === "" || IsAdmin) {

                const uid = interaction.member.user.id
                let Cooldown = GetServerData(interaction.guild_id)['Cooldown']
                let LastMessage = GetCooldown(uid)
                if (LastMessage > Cooldown || IsAdmin) {
                    SetCooldown(uid)
                    fs.writeFileSync('./dev/interaction.json', JSON.stringify(interaction, null, 4)) // Debug
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
                    MessageUser(
                        client,
                        interaction.member.user.id,
                        `Cooldown: Please wait ${Cooldown - (Math.round(LastMessage * 100) / 100)} seconds`
                    )
                }
            } else {
                let TypedChannel = await client.channels.fetch(interaction.channel_id).then(channel => {
                    return channel.name
                })
                let LockedChannel = await client.channels.fetch(ChannelLock).then(channel => {
                    return channel.name
                })

                MessageUser(
                    client,
                    interaction.member.user.id,
                    `The channel: \`#${TypedChannel}\` is locked, please use \`#${LockedChannel}\` to have access to Tarkov Helper commands`
                )
            }
        } catch (e) {
            console.log(e)
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