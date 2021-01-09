module.exports = {
    name: 'help',
    description: "Get help with how to use commands",
    execute(message, args){

        message.channel.send('help')

    }
}