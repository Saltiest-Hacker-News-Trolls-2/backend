function errHandler(err, req, res, next) {
  switch (err.type) {
    case 'INVALIDCRED':
      res.status(400).json({ msg: 'Invalid Credentials' })
      break

    default:
      return res
        .status(500)
        .json({ msg: 'There was an error processing your request', err })
  }
}

module.exports = errHandler
