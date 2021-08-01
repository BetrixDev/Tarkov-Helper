require('./utils')
const fs = require('fs')
require('dotenv').config()

const { AutoPoster } = require('topgg-autoposter')
const { GetCooldown, SetCooldown } = require('./scripts/cooldown')
const { GetServerData, IncreaseCommands } = require('./database')
const DiscordJS = require('discord.js')

let Start = new Date()

const client = new DiscordJS.Client()

const CommandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
const BotCommands = CommandFiles.map(file => { return file.split('.')[0] })

let ExcludedDMCommands = [
    'admin',
    'channellock',
    'resetchannellock',
    'setcooldown'
]

const poster = AutoPoster(process.env['TOPGG_TOKEN'], client)

poster.on('posted', (stats) => {
    Logger(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})

async function DMUser(uid, msg) {
    await client.users.fetch(uid).then(user => { user.send(msg) })
}

client.on('guildCreate', async(guild) => {
    let Embed = new DiscordJS.MessageEmbed()
        .setTitle(`Thank you for adding Tarkov Helper to ${guild.name}`)
        .setThumbnail(Settings.Images.Logo250)
        .setImage(Settings.Images.SecondBanner)
        .setDescription(`
        • Tarkov Helper is a Discord bot that aims to provide information within **Escape from Tarkov** to users of your Discord server in the easiest way possible.

        • Tarkov Helper makes use of Discord's slash command API so don't worry about informing your members of any prefixes or compatibility issues between others bots.

        • Use the \`/info\` command to gain more information about Tarkov Helper

        • A great first step to ensuring Tarkov Helper is as easy to use as possible you can configure it to your liking, start by using \`/admin @ADMIN_ROLE\`.

        • To learn more about how to use Tarkov Helper please head over to the [official wiki](https://github.com/BetrixEdits/Tarkov-Helper/wiki).

        `)
        .setFooter('This message was sent to your because you or a member with the \"Manage Server\" role added Tarkov Helper to a server you own')

    client.users.fetch(guild.ownerID).then(owner => owner.send(Embed))
})

client.on('ready', async() => {
    let End = new Date()
    Logger(`Tarkov Helper Initialized in ${End.getTime() - Start.getTime()}ms`)

    client.ws.on('INTERACTION_CREATE', async(interaction) => {
        try {
            Logger('-------------------------------------')
            Logger(`New command: ${interaction.data.name}`)
            let commandStart = new Date()

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

            Logger(`With args: ${JSON.stringify(args)}`)

            let uid
            let IsAdmin // Admins can bypass restrictions
            let ServerData
            if (interaction.member !== undefined) {
                uid = interaction.member.user.id
                ServerData = await GetServerData(interaction.guild_id)
                IsAdmin = interaction.member.roles.includes(ServerData['AdminRole'])
            } else {
                IsAdmin = true
                uid = interaction.user.id
                ServerData = {
                    ServerID: "",
                    AdminRole: "",
                    Cooldown: 3,
                    ChannelLock: ""
                }

                if (ExcludedDMCommands.includes(command)) {
                    Reply(interaction, ErrorMessage('Cannot use admin commands in a Direct Message channel'), true)
                    return
                }
            }

            let ChannelLock = ServerData['ChannelLock']
            if (ChannelLock === interaction.channel_id || ChannelLock === "" || IsAdmin) {

                let Cooldown = ServerData['Cooldown']
                let LastMessage = GetCooldown(uid)
                if (LastMessage > Cooldown || IsAdmin) {
                    SetCooldown(uid) // Update Cooldown

                    // If command exists locally
                    if (BotCommands.includes(command)) {
                        const guild = client.guilds.resolve(interaction.guild_id) // Needed for admin commands

                        const Message = await require(`./commands/${command}`)['CommandFunction'](args, { interaction, guild, serverCount: client.guilds.cache.size, serverData: ServerData, uid: uid })

                        if (Message.Type === "ServerMessage" || interaction.member === undefined) {
                            Reply(interaction, Message.Content)

                        } else if (Message.Type === "Ephemeral" || Message.Type === "Error") {
                            Reply(interaction, Message.Content, true)

                        }

                        IncreaseCommands(command)
                        Logger(`Command fulfilled in ${new Date().getTime() - commandStart.getTime()}ms`)
                        Logger('-------------------------------------')
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
            Logger('Command errored with the message')
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
    let Channel
    if (interaction.member !== undefined) {
        Channel = client.channels.resolve(interaction.channel_id)
    } else {
        Channel = await client.channels.fetch(interaction.channel_id)
    }
    const { data, files } = await DiscordJS.APIMessage.create(
            Channel,
            content
        )
        .resolveData()
        .resolveFiles()

    return {...data, files }
}

function InitBot(Dev) {
    client.login(process.env[!Dev ? 'BOT_TOKEN' : 'BOT_TOKEN_DEV'])
}

exports.DMUser = DMUser
exports.InitBot = InitBot