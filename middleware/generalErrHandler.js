function errHandler(err, req, res, next) {
  return res.status(500).json({
    errors: err.stack
  })
}

module.exports = errHandler
