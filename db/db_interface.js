const knex = require('knex')
const config = require('../knexfile')

//read the current environment from node
const environment = process.env.NODE_ENV || 'development'

// configure knex with current environment settings and export for use
module.exports = knex(config[environment])
