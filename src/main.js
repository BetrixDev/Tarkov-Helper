// Tarkov Data API from Tarkov Tools https://tarkov-tools.com/about/
// Some code snippets are also from Tarkov Tools
let Start = new Date()

const { GetCooldown, SetCooldown } = require('./cooldown')
const { GetServerData } = require('./command_modules/serverdata')
const { MessageUser } = require('./command_modules/messageuser')
const { KeepAlive } = require('./scripts/server')
const DiscordJS = require('discord.js')

const fs = require('fs')
require('dotenv').config()

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

                        if (Message.Type === "ServerMessage") {
                            await Reply(interaction, Message.Content)

                            const msg = await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({ data: {} })
                            JSMessage = new DiscordJS.Message(client, msg, client.channels.cache.get(msg.channel_id))

                        } else if (Message.Type === "Ephemeral" || Message.Type === "Error") {
                            Reply(interaction, Message.Content, true)
                        }

                        // Reaction Handler
                        let ReactionData = require(`./commands/${command}`)['CommandSettings'].ReactionData
                        if (ReactionData !== undefined && Message.Type !== "Error") { // Don't collect reactions on an error message
                            await AddReactionCollection(ReactionData, { Interaction: interaction, Message: JSMessage }, true)
                        }
                    }

                } else { // Message user that they are on cooldown
                    Reply(
                        interaction,
                        `Cooldown: Please wait ${Cooldown - (Math.round(LastMessage * 100) / 100)} seconds`,
                        true
                    )
                }
            } else { // Message user that they cannot type in this channel
                let TypedChannel = await client.channels.fetch(interaction.channel_id).then(channel => { return channel.name })
                let LockedChannel = await client.channels.fetch(ChannelLock).then(channel => { return channel.name })

                Reply(
                    interaction,
                    `The channel: \`#${TypedChannel}\` is locked, please use \`#${LockedChannel}\` to have access to Tarkov Helper commands`,
                    true
                )
            }
        } catch (e) {
            console.log(e)
        }
    })
})

// Replies to the orignial interaction 
const Reply = async(interaction, response, ephemeral) => {
    if (!ephemeral) {
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
        }).catch((e) => {
            console.log(e)
        })
    } else {
        let data = {
            content: response,
            flags: 64
        }

        if (typeof response === 'object') {
            data = await CreateAPIMessage(interaction, response)
            data['flags'] = 64
        }

        // Responds to the interaction with a message only the author can see
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data
            }
        }).catch((e) => {
            console.log(e)
        })
    }

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
    require('./command_modules/searchengine').InitSearchEngine()
    require('./command_modules/mapsearchengine').InitMapEngine()
    require('./command_modules/calibersearchengine').InitCaliberEngine()
    require('./tasks').StartTasks()

    KeepAlive()

    client.login(process.env.BOT_TOKEN)

    //client.login(process.env.BOT_TOKEN_DEV)
}
StartBot()

exports.ReactionHandler = ReactionHandler