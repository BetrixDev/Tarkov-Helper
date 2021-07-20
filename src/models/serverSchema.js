const mongoose = require('mongoose')

const serverSchema = new mongoose.Schema({
    ServerID: { type: String, require: true, unique: true },
    AdminRole: { type: String, require: true, default: "" },
    Cooldown: { type: Number, require: true, default: 3 },
    ChannelLock: { type: String, require: true, default: "" }
})

const model = mongoose.model('ServerModels', serverSchema)

module.exports = model