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

const DMCommands = new Array()
const BotCommands = new Array()
const CommandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
for (const File of CommandFiles) {
    BotCommands.push(File.split('.')[0])

    let CommandSettings = require(`./commands/${File}`)['CommandSettings']
    if (CommandSettings.DMCommand) {
        DMCommands.push(File.split('.')[0])
    }
}

// ----------

client.on('ready', async() => {
    let End = new Date()
    console.log(`Tarkov Helper Initialized in ${End.getTime() - Start.getTime()}ms`)

    const commands = await getApp(guildID).commands.get()

    let FormattedCommands = {}
    for (const c in commands) {
        let Command = commands[c]
        FormattedCommands[Command.name] = {
            ID: Command.id
        }
    }

    for (const File of CommandFiles) {
        let FormatFile = File.split('.')[0]
        let CommandData = require(`./commands/${FormatFile}`)['CommandSettings'].CommandData

        if (!FormattedCommands.hasOwnProperty(FormatFile) && CommandData !== undefined) {
            await getApp(guildID).commands.post(CommandData)
        }
    }

    // Used for slash commands
    client.ws.on('INTERACTION_CREATE', async(interaction) => {
        try { // Try block so we can ignore interactions without erroring the bot
            let IsAdmin = interaction.member.roles.includes(GetServerData(interaction.guild_id)['AdminRole']) // Admins can bypass restrictions

            let ChannelLock = GetServerData(interaction.guild_id)['ChannelLock']
            if (ChannelLock === interaction.channel_id || ChannelLock === "" || IsAdmin) {

                const uid = interaction.member.user.id

                let Cooldown = GetServerData(interaction.guild_id)['Cooldown']
                let LastMessage = GetCooldown(uid)
                if (LastMessage > Cooldown || IsAdmin) {
                    SetCooldown(uid) // Update Cooldown

                    // Format arguments into easier and easier to use object
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

                        const Message = await require(`./commands/${command}`)['CommandFunction'](args, { interaction, guild })

                        let JSMessage

                        if (Message.Type === "ServerMessage" || Message.Type === "Error") {
                            await Reply(interaction, Message.Content)

                            const msg = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({ data: {} })
                            JSMessage = new DiscordJS.Message(client, msg, client.channels.cache.get(msg.channel_id))

                        } else if (Message.Type === "DirectMessage") {
                            JSMessage = MessageUser( // This will return the DiscordJS Message after dming the user
                                client,
                                interaction.member.user.id,
                                Message.Content
                            )
                        }

                        // If message is an error then set the message to delete after a set time
                        if (Message.Type === "Error") {
                            setTimeout(() => JSMessage.delete(), Message.Time || 10000)
                        }

                        // Reaction Handler
                        let ReactionData = require(`./commands/${command}`)['CommandSettings'].ReactionData
                        if (ReactionData !== undefined && Message.Type !== "Error") { // Don't collect reactions on an error message
                            await AddReactionCollection(ReactionData, { Interaction: interaction, Message: JSMessage }, true)
                        }
                    }

                } else { // Message user that they are on cooldown
                    MessageUser(
                        client,
                        interaction.member.user.id,
                        `Cooldown: Please wait ${Cooldown - (Math.round(LastMessage * 100) / 100)} seconds`
                    )
                }
            } else { // Message user that they cannot type in this channel
                let TypedChannel = await client.channels.fetch(interaction.channel_id).then(channel => { return channel.name })
                let LockedChannel = await client.channels.fetch(ChannelLock).then(channel => { return channel.name })

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

    // Used for direct message commands
    client.on('message', async(message) => {
        try {
            if (!message.author.bot && message.guild === null) {
                let command = message.content.replace('/', '').replace('!', '').split(' ')[0]

                if (DMCommands.includes(command)) {
                    let CommandSettings = require(`./commands/${command}`)['CommandSettings'].CommandData


                    // Since DM commands only have 1 input this will work
                    let options = CommandSettings.data.options
                    let args = {}
                    if (options.length > 0) {
                        args[options[0].name] = message.content.split(' ')[1]
                    }

                    let Message = await require(`./commands/${command}`)['CommandFunction'](args)

                    message.reply(Message.Content)

                    // Reaction Handler
                    let ReactionData = require(`./commands/${command}`)['CommandSettings'].ReactionData
                    if (ReactionData !== undefined && Message.Type !== "Error") { // Don't collect reactions on an error message
                        await AddReactionCollection(ReactionData, { Message: message }, false)
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    })
})

// Replies to the orignial interaction 
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

// Converts an embeded message into a message discord can use for the interaction message
const CreateAPIMessage = async(interaction, content) => {
    const { data, files } = await DiscordJS.APIMessage.create(
            client.channels.resolve(interaction.channel_id),
            content
        )
        .resolveData()
        .resolveFiles()

    return {...data, files }
}

async function ReactionHandler(ReactionData, Data, FromInteraction) {
    for (const EmojiID in ReactionData) {
        let Reaction = ReactionData[EmojiID]

        if (FromInteraction) { // If this function was called from inside "INTERACTION_CREATE"
            Data.Message.react(EmojiID)

            let Filter = (reaction, user) => {
                return user.id === Data.Interaction.member.user.id
            }

            let Collector = Message.createReactionCollector(Filter, { max: 1, time: 180000 })
            Collector.on('collect', (reaction, user) => {
                Reaction.CallBack(Message, Data.Interaction.member.user.id)
            })

        } else { // If this function was called from a callback
            Data.Message.react(EmojiID)

            let Filter = (reaction, user) => {
                return user.id === Data.CommandAuthor
            }

            let Collector = Message.createReactionCollector(Filter, { max: 1, time: 180000 })
            Collector.on('collect', (reaction, user) => {
                Reaction.CallBack(Message, Data.CommandAuthor)
            })

        }
    }
}

const StartBot = async() => {
    const { InitSearchEngine } = require('./command_modules/searchengine')
    const { InitMapEngine } = require('./command_modules/mapsearchengine')
    const { InitCaliberEngine } = require('./command_modules/calibersearchengine')
    const { StartTasks } = require('./tasks')

    InitSearchEngine()
    InitMapEngine()
    InitCaliberEngine()
    StartTasks()

    client.login(process.env.BOT_TOKEN)
}
StartBot()

exports.ReactionHandler = ReactionHandler