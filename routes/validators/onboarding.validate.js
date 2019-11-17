const { body } = require('express-validator')

const { allPurpose: kxa } = require('../../db/dml')

module.exports = {
  validateLogin
}

function validateLogin() {
  return [
    body('username')
      .exists()
      .withMessage('Username and Password are required to log in.'),
    body('password')
      .exists()
      .withMessage('Username and Password are required to log in.')
    // search for user and compare password
  ]
}
