const { body } = require('express-validator')

const { allPurpose: kxa } = require('../../db/dml')

module.exports = {
  validateLogin,
  validateRegister
}

function validateRegister() {
  const missing = 'A username, password, and email are required to register.'
  return [
    body('username')
      .exists()
      .withMessage(missing)
      .bail()
      .not()
      .matches(/[\W]/)
      .withMessage(
        'Username may only contain letters, numbers, and underscores.'
      ),
    body('password')
      .exists()
      .withMessage(missing)
      .bail(),
    body('email')
      .exists()
      .withMessage(missing)
      .bail()
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .trim()
  ]
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
