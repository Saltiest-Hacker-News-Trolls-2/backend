const { validationResult } = require('express-validator')

const handleValidationErr = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  return res.status(422).json(errors.mapped())
}

module.exports = handleValidationErr
