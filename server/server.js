const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const { available_routes } = require('./helpMessage')

const server = express()

// middleware
server.use(express.json(), helmet(), cors(), morgan('dev'))

//custom middlweare
const { restrictJWT } = require('../middleware')

// Routes
const { usersRoutes, onboardingRoutes } = require('../routes')

// route handlers
server.use('/api/', onboardingRoutes)
server.use('/api/users', restrictJWT, usersRoutes)

// route not found
server.use((req, res) => {
  res.status(404).json({ available_routes })
})

module.exports = server
