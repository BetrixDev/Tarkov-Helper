module.exports = {
    apps: [{
        name: 'tarkovhelper',
        script: './build/main.js',
        env: {
            "NODE_ENV": "production"
        }
    }]
}