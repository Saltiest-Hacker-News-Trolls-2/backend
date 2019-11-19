const { validationResult } = require('express-validator')

const handleValidationErr = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  const formatted = {}
  for (let [k, v] of Object.entries(errors.mapped())) {
    if (formatted[k]) {
      return
    }
    formatted[k] = v.msg
  }

  return res.status(422).json({ errors: formatted })
}

module.exports = handleValidationErr
