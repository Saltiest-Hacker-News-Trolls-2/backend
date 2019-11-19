function errHandler(err, req, res, next) {
  switch (err.type) {
    default:
      return res
        .status(500)
        .json({
          errors: [{ other: 'There was an error processing your request.' }],
          err
        })
  }
}

module.exports = errHandler
