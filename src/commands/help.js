module.exports = {
    data: {
        name: 'help',
        description: 'Returns basic info on how to use Tarkov Helper',
        options: []
    },
    message: (args, obj) => {
        return require('./info').message(args, obj)
    }
}