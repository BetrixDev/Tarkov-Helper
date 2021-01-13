const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();
client.commands = new Discord.Collection();

const prefix = '!'  //Character required before command to tell the bot that it is a command

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}

client.once('ready', () => { 
    console.log('Tarkov Helper Initialized')    // Log to console when bot is ready (not needed)
})

client.on('message', async message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    
    switch(command) {   // Add commands here
        case 'help' :
        case 'h' :
            client.commands.get('help').execute(message, args, Discord);
        break;
        case 'bitcoinfarm' :
        case 'bf' :
            client.commands.get('bitcoinfarm').execute(message, args, Discord);
        break;
        case 'map' :
        case 'm' :
            client.commands.get('map').execute(message, args, Discord);
        break;
        case 'price' :
        case 'p' :
            client.commands.get('price').execute(message, args, Discord);
        break;
    }
});

client.login(process.env.BOT_TOKEN); // Make an enviroment variable called "BOT_TOKEN=*YOUR_TOKEN_HERE*" inside of a .env file