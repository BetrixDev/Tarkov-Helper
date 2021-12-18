echo "-= BOT CONFIGURATION =-"
echo "Please enter your bot\'s token"
read token

touch src/data/bot/config.json5
echo "{
    // Discord Bot Configuration
    // Remove _EXAMPLE from this file to make it valid

    // Find your bot's token by going here: https://discord.com/developers/applications YOUR_BOT> Bot> Copy Token
    BotToken: '$token',

    // Add this token is you have a seperate bot used for developing the bot
    BotDevToken: '',

    // If you have a dev server and would like instant command updates put it here
    DevServerID: '',

    // MongoDB Atlas url for storing server specific data (can also be done locally with some changes to Database.ts)
    MongoURL: ''
}" > src/data/bot/config.json5

echo "Bot token set, to add dev variables, edit src/data/bot/config.json5"