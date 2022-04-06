module.exports = {
    apps: [
        {
            name: 'tarkovhelper',
            script: './build/src/Main.js',
            env: {
                NODE_ENV: 'prod'
            }
        }
    ]
}
