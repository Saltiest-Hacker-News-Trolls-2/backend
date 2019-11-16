const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const helpMessage = require('./helpMessage')

const server = express()

// middleware
server.use(express.json(), helmet(), cors(), morgan('dev'))

// Routes
const { usersRoutes } = require('../routes')

// route handlers
server.use('/api/users', usersRoutes)

// route not found
server.use((req, res) => {
  res.status(404).json({ no_route: req.originalUrl, helpMessage })
})

module.exports = server
