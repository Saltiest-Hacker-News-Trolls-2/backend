const generateJWT = require('../../jwt/generateJWT')

const testUser = {
  username: 'ned',
  email: 'ned@mail.com',
  password: 'abc?123'
}

const hashed = '$2a$12$QAKFHsSTGOSLASd7mUhiCeQFcUTxD4ObQnfomm0g32oXsN8gBOqpi'

const joe = {
  username: 'joe',
  email: 'joe@mail.com',
  password: 'joesmith'
}

const token = generateJWT({ id: 1 })

module.exports = { testUser, hashed, joe, token }
