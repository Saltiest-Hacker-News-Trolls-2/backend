const restrictJWT = require('./restrictJWT')
const handleValidationErr = require('./handleValidationErr')
const generalErr = require('./generalErrHandler')
const logErrors = require('./logErrors')

module.exports = {
  restrictJWT,
  handleValidationErr,
  generalErr,
  logErrors
}
