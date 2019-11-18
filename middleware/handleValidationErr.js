const { validationResult } = require('express-validator')

const handleValidationErr = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  const formatted = errors.errors.reduce((errs, err) => {
    return !errs.includes(err.msg) ? (errs = [...errs, err.msg]) : errs
  }, [])

  return res.status(422).json({ errors: formatted })
}

module.exports = handleValidationErr
