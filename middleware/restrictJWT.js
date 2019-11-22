const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET || 'foobar'
    const id = req.params.id
    let token = req.headers.authorization

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(400).json({ message: 'Not Authorized' })
      } else if (Number(decoded.subject) !== Number(id)) {
        res.status(400).json({ message: 'Not Authorized' })
      } else {
        req.headers.subject = decoded.subject
        next()
      }
    })
  } catch (err) {
    next(err)
  }
}
