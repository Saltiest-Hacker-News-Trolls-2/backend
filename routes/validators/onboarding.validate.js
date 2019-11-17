const { body } = require('express-validator')

const { allPurpose: kxa } = require('../../db/dml')

module.exports = {
  validateLogin
}

function validateLogin() {
  return [
    body('username')
      .exists()
      .withMessage('Username and Password are required to login.'),
    body('password')
      .exists()
      .withMessage('Username and Password are required to login.')
    // search for user and compare password
  ]
}
