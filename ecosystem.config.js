module.exports = {
    apps: [{
        name: 'tarkovhelper',
        script: './build/Bot.js',
        env: {
            "NODE_ENV": "production"
        }
    }]
}