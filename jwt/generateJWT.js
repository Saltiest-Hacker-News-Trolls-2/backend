const jwt = require('jsonwebtoken')

function generateToken(user) {
  const payload = {
    // will be 'sub' property of jwt
    subject: user.id
  }
  // string used to sign the jwt and authenticate it
  const secret = process.env.JWT_SECRET || 'foobar'

  const options = {
    // expire after  seven days
    expiresIn: '7d'
  }

  return jwt.sign(payload, secret, options)
}

module.exports = generateToken
