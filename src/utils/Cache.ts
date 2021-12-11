const NodeCache = require('node-cache')

const commandCache = new NodeCache({ stdTTL: 300, checkperiod: 120, deleteOnExpire: true })

export const AppendCache = async (key: string, val: object): Promise<boolean> => {
    return commandCache.set(key, val)
}

export const ReadCache = async (key: string): Promise<object | null> => {
    const value = commandCache.take(key)

    if (value) {
        return value
    } else {
        return null
    }
}
