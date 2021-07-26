const mongoose = require('mongoose')

const commandSchema = new mongoose.Schema({
    name: { type: String, require: true },
    commands: { type: Number, require: true }
})

const model = mongoose.model('commandcounters', commandSchema)

module.exports = model