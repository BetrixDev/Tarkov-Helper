import { Schema, model } from 'mongoose'

const serverSchema = new Schema({
    ServerID: { type: String, require: true, unique: true },
    AdminRole: { type: String, require: true, default: '' },
    Cooldown: { type: Number, require: true, default: 3 },
    ChannelLock: { type: String, require: true, default: '' }
})

const serverModel = model('ServerModels', serverSchema)

export { serverModel }
