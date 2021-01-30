// Load required modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();


// load command_modules
const { GetConfigData } = require("./command_modules/getconfigdata")
const { GetCalibers } = require("./command_modules/getcalibers");


// Load all commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


// Call function to load calibers
GetCalibers()


client.once('ready', () => {
    console.log('Tarkov Helper Initialized')
})


// Command handler
client.on('message', async message => {
    let prefix = "!"
    if (GetConfigData(message) !== undefined) { prefix = GetConfigData(message).Prefix }
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'help':
        case 'h':
            client.commands.get('help').execute(message, args, Discord); // DOESNT NEED FIXING BUT JUST UPDATING
            break;
        case 'bitcoinfarm':
        case 'bf':
            client.commands.get('bitcoinfarm').execute(message, args, Discord); // CLEAN UP CODE
            break;
        case 'map':
        case 'm':
            client.commands.get('map').execute(message, args, Discord); // CLEAN UP CODE
            break;
        case 'price':
        case 'p':
            //client.commands.get('price').execute(message, args, Discord); //CANT DO YET
            break;
        case 'prefixset':
            client.commands.get('prefix').execute(message, args, Discord); // MAKE PREFIX MORE EFFICIENT AND WORK BETTER
            break;
        case 'stats':
        case 's':
            client.commands.get('stat').execute(message, args, Discord); // USE NEW CHACHED FILE DATA FOR STATS
            break;
        case 'xpto':
        case 'xp':
            client.commands.get('xpto').execute(message, args, Discord); // CLEAN UP CODE
            break;
        case 'quest':
        case 'q':
            client.commands.get('quest').execute(message, args, Discord); // USE NEW CHACHED FILE DATA FOR QUESTS
            break;
        case 'caliber':
        case 'calibre':
        case 'c':
            client.commands.get('caliber').execute(message, args, Discord); // CLEAN UP CODE / FIND A BETTER WAY TO DISPLAY DATA
            break;
    }
});

// Log to bot in with custom bot token
client.login(process.env.BOT_TOKEN);