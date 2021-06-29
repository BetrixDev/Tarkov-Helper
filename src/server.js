let Express = require('express')

let Server = Express()

Server.all('/', (req, res) => {
    res.send('Bot is responding')
})

function KeepAlive() {
    Server.listen(3000, () => {
        console.log('Server Initialized')
    })
}

exports.KeepAlive = KeepAlive