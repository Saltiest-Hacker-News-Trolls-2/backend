const generateJWT = require('../../jwt/generateJWT')

const testUser = {
  username: 'ned',
  email: 'ned@mail.com',
  password: 'abc?123'
}

const hashed = '$2a$12$QAKFHsSTGOSLASd7mUhiCeQFcUTxD4ObQnfomm0g32oXsN8gBOqpi'

const hashedUser = { ...testUser, password: hashed }

const joe = {
  username: 'joe',
  email: 'joe@mail.com',
  password: 'joesmith'
}

const favorites = [
  { user_id: 1, comment_id: 1 },
  { user_id: 1, comment_id: 2 },
  { user_id: 1, comment_id: 3 },
  { user_id: 1, comment_id: 4 }
]

const comments = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]

const token = generateJWT({ id: 1 })

module.exports = {
  favorites,
  testUser,
  hashed,
  joe,
  token,
  hashedUser,
  comments
}
