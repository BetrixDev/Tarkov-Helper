const Express = require('express')

let Server = Express()

Server.all('/', (req, res) => {
    res.send('Bot is running')
})

function KeepAlive() {
    Server.listen(3000, () => {
        console.log('Server is ready')
    })
}

exports.KeepAlive = KeepAlive