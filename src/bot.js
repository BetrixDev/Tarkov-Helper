require('./utils')
const fs = require('fs')
require('dotenv').config()

const { AutoPoster } = require('topgg-autoposter')
const { GetCooldown, SetCooldown } = require('./scripts/cooldown')
const { GetServerData, IncreaseCommands } = require('./database')
const discordjs = require('discord.js')

let Start = new Date()

const client = new discordjs.Client({ intents: [discordjs.Intents.FLAGS.GUILDS] })

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

client.on('guildCreate', async (guild) => {
    let Embed = new discordjs.MessageEmbed()
        .setTitle(`Thank you for adding Tarkov Helper to ${guild.name}`)
        .setThumbnail(Settings.Images.Logo250)
        .setImage(Settings.Images.SecondBanner)
        .setDescription(`
        • Tarkov Helper is a Discord bot that aims to provide information within **Escape from Tarkov** to users of your Discord server in the easiest way possible.

        • Tarkov Helper makes use of Discord's slash command API so don't worry about informing your members of any prefixes or compatibility issues between others bots.

        • Use the \`/info\` command to gain more information about Tarkov Helper

        • A great first step to ensuring Tarkov Helper is as easy to use as possible you can configure it to your liking, start by using \`/admin @ADMIN_ROLE\`.

        • To learn more about how to use Tarkov Helper please head over to the [official wiki](https://github.com/BetrixDev/Tarkov-Helper/wiki).

        `)
        .setFooter('This message was sent to your because you or a member with the \"Manage Server\" role added Tarkov Helper to a server you own')

    client.users.fetch(guild.ownerID).then(owner => owner.send(Embed))
})

client.on('ready', async () => {
    let End = new Date()
    Logger(`Tarkov Helper Initialized in ${End.getTime() - Start.getTime()}ms`)

    client.on('interactionCreate', async (interaction) => {
        try {
            if (interaction.isCommand()) {

                let commandName = interaction.commandName

                Logger('-------------------------------------')
                Logger(`New command: ${commandName}`)
                let commandStart = new Date()

                let command = require(`./commands/${commandName}`)

                // Format arguments into easier to use object
                const args = {}
                if (command.data.options) {
                    for (let arg of command.data.options) {
                        let input = interaction.options.get(arg.name)
                        if (!input) { continue }

                        args[arg.name] = input.value
                    }
                }

                Logger(`With args: ${JSON.stringify(args)}`)

                let uid = interaction.user.id
                let IsAdmin // Admins can bypass restrictions
                let ServerData
                if (interaction.inGuild()) {
                    let userRoles = await client.guilds.fetch(interaction.guildId).then(guild => {
                        return guild.members.fetch(uid).then(user => { return user.roles.cache.map(role => role.id) })
                    })

                    ServerData = await GetServerData(interaction.guildId)
                    IsAdmin = userRoles.includes(ServerData['AdminRole'])
                } else {
                    IsAdmin = true
                    ServerData = {
                        ServerID: "",
                        AdminRole: "",
                        Cooldown: 3,
                        ChannelLock: ""
                    }

                    if (ExcludedDMCommands.includes(commandName)) {
                        interaction.reply({ embeds: [ErrorMessage('Cannot use admin commands in a Direct Message channel')], ephemeral: true })
                        return
                    }
                }

                let ChannelLock = ServerData['ChannelLock']

                if (ChannelLock === interaction.channelId || ChannelLock === "" || IsAdmin) {

                    let Cooldown = ServerData['Cooldown']
                    let LastMessage = GetCooldown(uid)
                    if (LastMessage > Cooldown || IsAdmin) {
                        SetCooldown(uid) // Update Cooldown

                        // If command exists locally
                        if (BotCommands.includes(commandName)) {
                            const guild = client.guilds.resolve(interaction.guildId) // Needed for admin commands

                            const message = await command.message(args, { interaction, guild, serverCount: client.guilds.cache.size, serverData: ServerData, uid: uid, isAdmin: IsAdmin })
                            let object = new Object()

                            if (message.Content !== undefined) {
                                if (typeof (message.Content) !== 'string') {
                                    object['embeds'] = [message.Content]
                                } else {
                                    object['content'] = message.Content
                                }
                            }
                            if (message.Files !== undefined) { object['files'] = [message.Files] }
                            if (message.Components !== undefined) { object['components'] = message.Components }

                            let ephemeral = false
                            if (message.Type == 'ephemeral' || message.Type == 'error') { ephemeral = true }
                            object['ephemeral'] = ephemeral

                            interaction.reply(object)

                            IncreaseCommands(commandName)
                            Logger(`Command fulfilled in ${new Date().getTime() - commandStart.getTime()}ms`)
                            Logger('-------------------------------------')
                        }

                    } else { // Message user that they are on cooldown
                        interaction.reply({
                            content: `Cooldown: Please wait ${Cooldown - (Math.round(LastMessage * 100) / 100)} seconds`,
                            ephemeral: true
                        })
                    }
                } else { // Message user that they cannot type in this channel
                    let TypedChannel = await client.channels.fetch(interaction.channelId).then(channel => { return channel.name })
                    let LockedChannel = await client.channels.fetch(ChannelLock).then(channel => { return channel.name })

                    interaction.reply({
                        content: `The channel: \`#${TypedChannel}\` is locked, please use \`#${LockedChannel}\` to have access to Tarkov Helper commands`,
                        ephemeral: true
                    })
                }
            } else if (interaction.isSelectMenu()) {
                let id = interaction.customId

                let uid = interaction.user

                let commandName = id.split('__')[0]
                let args = JSON.parse(id.split('__')[2])
                let variable = id.split('__')[1]

                args[variable] = interaction.values[0]

                let command = require(`./commands/${commandName}`)

                let newMessage = await command.message(args, {
                    interaction,
                    serverData: {
                        ServerID: "",
                        AdminRole: "",
                        Cooldown: 1,
                        ChannelLock: ""
                    },
                    uid: uid,
                    isAdmin: false
                })

                let msg = {
                    embeds: [newMessage.Content],
                    ephemeral: newMessage.Type === 'error' || newMessage.Type === 'ephemeral' ? true : false,
                    components: newMessage.Components
                }

                if (newMessage.Files !== undefined) {
                    msg.files = [newMessage.Files]
                }

                interaction.reply(msg)
            }
        } catch (e) {
            Logger('Command errored with the message')
            console.log(e)
        }
    })
})

function InitBot(Dev) {
    client.login(process.env[!Dev ? 'BOT_TOKEN' : 'BOT_TOKEN_DEV'])
}

exports.DMUser = DMUser
exports.InitBot = InitBot
