const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    vegetarian: {
        type: Boolean,
        required: true
    },
    age3: {
        type: Boolean,
        required: true
    },
    attending: {
        type: Boolean,
        required: true
    },
    group: {
        type: mongoose.ObjectId,
        required: true
    }
})

module.exports = mongoose.model('Guest', guestSchema)