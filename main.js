const DiscordJS = require('discord.js')
const fs = require('fs')
require('dotenv').config()

const guildID = '797601083589001227'
const client = new DiscordJS.Client()

const getApp = (guildID) => {
    const app = client.api.applications(client.user.id)
    if (guildID) {
        app.guilds(guildID)
    }
    return app
}

const BotCommands = new Array()
const CommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const File of CommandFiles) {
    BotCommands.push(File.split('.')[0])
}

client.on('ready', async() => {
    console.log('Bot Ready')

    const commands = await getApp(guildID).commands.get()
        //console.log(commands)

    await getApp(guildID).commands.post({
        data: {
            name: 'bitcoinfarm',
            description: 'Calculate to amount of money obtained from a certain amount of Graphics Cards',
            options: [{
                    name: 'gpus',
                    description: 'Amount of GPUS to calculate with',
                    required: true,
                    type: 4
                },
                {
                    name: "compare-gpus",
                    description: 'Use this to display the difference between two different GPU amount',
                    required: false,
                    type: 4
                }
            ]
        }
    })

    client.ws.on('INTERACTION_CREATE', async(interaction) => {
        const { name, options } = interaction.data
        const command = name.toLowerCase()
        const args = {}

        if (options) {
            for (const option of options) {
                const { name, value } = option
                args[name] = value
            }
        }

        // Commands return an embeded message

        // If command exists locally
        if (BotCommands.includes(command)) {
            const message = require(`./commands/${command}`)[command](DiscordJS, args)
            Reply(interaction, message)
        } else {
            Reply(interaction, 'This command has no logic yet')
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


client.login(process.env.BOT_TOKEN)