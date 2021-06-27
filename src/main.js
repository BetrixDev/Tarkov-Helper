// Tarkov Data API from Tarkov Tools https://tarkov-tools.com/about/
// Some code snippets are also from Tarkov Tools
let Start = new Date();

const { GetCooldown, SetCooldown } = require('./scripts/cooldown')
const { GetServerData } = require('./command_modules/serverdata')
const DiscordJS = require('discord.js')

const fs = require('fs')
require('dotenv').config()

const client = new DiscordJS.Client()

const BotCommands = new Array()
const CommandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

// ----------

client.on('ready', async() => {
    let End = new Date()
    console.log(`Tarkov Helper Initialized in ${End.getTime() - Start.getTime()}ms`)

    // Used for slash commands
    client.ws.on('INTERACTION_CREATE', async(interaction) => {
        try { // Try block so we can ignore interactions without erroring the bot
            let IsAdmin // Admins can bypass restrictions
            if (interaction.guild_id === undefined) {
                IsAdmin = true
            } else {
                IsAdmin = interaction.member.roles.includes(GetServerData(interaction.guild_id)['AdminRole'])
            }

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

                        if (Message.Type === "ServerMessage") {
                            await Reply(interaction, Message.Content)


                        } else if (Message.Type === "Ephemeral" || Message.Type === "Error") {
                            Reply(interaction, Message.Content, true)
                        }

                        // Reaction Handler
                        let ReactionData = require(`./commands/${command}`)['CommandSettings'].ReactionData
                        if (ReactionData !== undefined && Message.Type !== "Error") { // Don't collect reactions on an error message
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

const StartBot = async() => {

    for (const File of CommandFiles) {
        BotCommands.push(File.split('.')[0])
    }

    require('./command_modules/searchengine').InitSearchEngine()
    require('./command_modules/calibersearchengine').InitCaliberEngine()
    require('./tasks').StartTasks()

    client.login(process.env.BOT_TOKEN)

    //client.login(process.env.BOT_TOKEN_DEV)
}
StartBot()