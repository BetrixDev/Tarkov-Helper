require('./utils')
const mongoose = require('mongoose')
require('dotenv').config()

async function StartBot(Dev) {
    // Cache data and start the scheduled functions for grabbing data from apis
    require('./command_modules/itemsearchengine')
    require('./command_modules/searchengine').InitSearchEngine()
    require('./command_modules/calibersearchengine').InitCaliberEngine()

    mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
        Logger('Connected to database')
    }).catch((e) => {
        console.log(e)
    })

    if (!Dev) {
        await require('./tasks').InvokeDatabase()
        require('./tasks').StartTasks()
    }

    require('./bot').InitBot(Dev)

}
StartBot() // Pass in true to use BOT_TOKEN_DEV to log your bot in and bypass waiting for caching