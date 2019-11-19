const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET || 'foobar'
    const id = req.params.id
    let token = req.headers.authorization

    const { subject } = jwt.verify(token, secret)
    // id in token must match request.params
    if (Number(subject) !== Number(id)) {
      throw new Error('Not Authorized.')
    }

    req.headers.subject = subject
    next()
  } catch (err) {
    res.status(400).json({ errors: [err.message] })
  }
}
