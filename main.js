const { GetConfigData } = require("./command_modules/getconfigdata")
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();
const Config = require('./config.json');
const { GetItems } = require("./command_modules/getdata");
const { GetQuests } = require("./command_modules/getquests");
const { GetCalibers } = require("./command_modules/getcalibers");


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

function CacheData() {
    GetItems()
    GetQuests()
    GetCalibers()
}

client.once('ready', () => {
    console.log('Tarkov Helper Initialized')
})

client.on('message', async message => {
    let prefix = "!"
    if (GetConfigData(message) !== undefined) { prefix = GetConfigData(message).Prefix }
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'help':
        case 'h':
            client.commands.get('help').execute(message, args, Discord);
            break;
        case 'bitcoinfarm':
        case 'bf':
            client.commands.get('bitcoinfarm').execute(message, args, Discord);
            break;
        case 'map':
        case 'm':
            client.commands.get('map').execute(message, args, Discord);
            break;
        case 'price':
        case 'p':
            //client.commands.get('price').execute(message, args, Discord);
            break;
        case 'prefixset':
            client.commands.get('prefix').execute(message, args, Discord);
            break;
        case 'stats':
        case 's':
            client.commands.get('stat').execute(message, args, Discord);
            break;
        case 'xpto':
        case 'xp':
            client.commands.get('xpto').execute(message, args, Discord);
            break;
        case 'quest':
        case 'q':
            client.commands.get('quest').execute(message, args, Discord);
            break;
        case 'caliber':
        case 'calibre':
        case 'c':
            client.commands.get('caliber').execute(message, args, Discord);
            break;
    }
});

CacheData()
client.login(process.env.BOT_TOKEN);