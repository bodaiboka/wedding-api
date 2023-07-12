require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())

const guestsRouter = require('./routes/guests')
const groupRouter = require('./routes/groups')
app.use('/guests', guestsRouter)
app.use('/groups', groupRouter)

app.listen(3000, () => {
    console.log("server has started")
})

