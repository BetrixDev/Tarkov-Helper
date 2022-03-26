import { Schema, model } from 'mongoose'

const serverSchema = new Schema({
    ServerID: { type: String, required: true, unique: true },
    ChannelLock: { type: String, required: false, default: '' },
    Language: { type: String, required: true, default: 'en' },
    Cooldown: { type: Number, required: true, default: 3 }
})

const serverModel = model('ServerModels', serverSchema)

export { serverModel }
