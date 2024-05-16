const express = require('express')
const cors = require('cors')
const createError = require('http-errors')
const dotenv = require('dotenv')
dotenv.config()

const authRoutes = require('./routes/authRoutes')
const messageRoutes = require('./routes/messageRoutes')
const db = require('./db/db')
const { app, server } = require('./socket/socket')

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/', authRoutes)
app.use('/messages', messageRoutes)

app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
})

db.sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been successfully established.')
        return db.sequelize.sync()
    })
    .then(() => {
        console.log('Models have been successfully synchronized with the database.')
        server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err.message)
    })