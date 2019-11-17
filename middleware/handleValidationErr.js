const { validationResult } = require('express-validator')

const handleValidationErr = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  const formatted = errors.errors.reduce((errs, err) => {
    if (!errs.includes(err.msg)) {
      errs.push(err.msg)
      return errs
    } else {
      return errs
    }
  }, [])

  return res.status(422).json({ errors: formatted })
}

module.exports = handleValidationErr
