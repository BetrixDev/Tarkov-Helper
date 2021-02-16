let Start = new Date()

// Load required modules
var Discord = require('discord.js');
var client = new Discord.Client();
var cron = require('node-cron')
var fs = require('fs');
require('dotenv').config();


// load command_modules
//var { GetConfigData } = require("./command_modules/getconfigdata")
var { GetCalibers } = require("./command_modules/getcalibers");
var { NotifyMessage } = require("./command_modules/notifymessage")

// Load data
let ResetData = JSON.parse(fs.readFileSync('./resetdata.json'))


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
    let End = new Date()
    console.log(`Tarkov Helper Initialized in ${End.getTime() - Start.getTime()}ms`)
})


// Command handler
client.on('message', async message => {
    let prefix = "!th"
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    // Fix for having a space between prefix and command just quality of life change
    if (args[0] === '') { args.shift() }

    const command = args.shift().toLowerCase();

    /*
    // Using if statement since has multiple conditions
    if (command === "notify" && message.guild === null) {
        client.commands.get('notify').execute(message, args, Discord);
    }
    */

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
            /*
        case 'price':
        case 'p':
            client.commands.get('price').execute(message, args, Discord);
            break;
            */
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
            /*
        case 'weaponbuilder':
        case 'weaponbuild':
        case 'wb':
            client.commands.get('weaponbuilder').execute(message, args, Discord);
            break;
            */
    }
});

// Log to bot in with custom bot token
client.login(process.env.BOT_TOKEN);