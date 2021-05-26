const { exec } = require("child_process")

console.log('Downloading Node Packages')

exec('npm i', (error, stdout, stderr) => {
    if (error) {
        console.error(error)
        return
    }
    console.log(stdout)

    console.log('Retrieving Game Data From APIS')
    require('../tasks').StartTasks()

    setTimeout(() => {
        console.log('\nStarting Bot')
        console.log('-------------------\n')
        require('../main')
    }, 5000)
})