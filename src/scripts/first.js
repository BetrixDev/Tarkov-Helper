(async() => {
    const fs = require('fs')
    const { exec } = require("child_process")

    console.log('Downloading Node Packages')

    exec('npm i', (error, stdout, stderr) => {
        if (error) {
            console.error(error)
            return
        }
        console.log(stdout)

        console.log('Retrieving Game Data From APIS')

        try {
            fs.writeFileSync('./src/bot_data/notifylist.json', JSON.stringify({}))
            fs.writeFileSync('./src/bot_data/commands.json', JSON.stringify({}))
            fs.mkdirSync('./src/game_data/')
        } catch {}

        setTimeout(async() => {
            require('../tasks').InvokeDatabase().then(() => {
                require('../tasks').StartTasks()

                setTimeout(() => {
                    console.log('\nStarting Bot')
                    console.log('-------------------\n')
                    require('../main')
                }, 5000)
            })


        }, 7500)

    })
})()