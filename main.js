//Bot Website: https://discord.com/developers/applications/797600238449590334/bot
//Add Bot Link: https://discord.com/oauth2/authorize?client_id=797600238449590334&scope=bot&permissions=67624000
const Discord = require('discord.js');

const client = new Discord.Client();

const prefix = '!'

const fs = require('fs');

require('dotenv').config();
console.log(process.env);

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Tarkov Helper Ready')
})

client.on('message', async message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
 
    if(command === 'help'){
        client.commands.get('help').execute(message, args, Discord);
    } 
    else if(command === 'bitcoinfarm')
    {
        client.commands.get('bitcoinfarm').execute(message, args, Discord);
    }
});


client.login(process.env.BOT_TOKEN);