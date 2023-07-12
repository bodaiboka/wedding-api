const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lang: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Group', groupSchema)