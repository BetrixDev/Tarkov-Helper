module.exports = {
    apps: [
        {
            name: 'tarkovhelper',
            script: './build/src/main.js',
            env: {
                NODE_ENV: 'prod'
            }
        }
    ]
}
