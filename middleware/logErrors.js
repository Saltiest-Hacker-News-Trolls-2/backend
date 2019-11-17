function logErrors(err, req, res, next) {
  console.error('Errors: ', err.stack)
  next(err)
}
module.exports = logErrors
