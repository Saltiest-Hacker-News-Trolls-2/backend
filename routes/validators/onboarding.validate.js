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
      )
      .isLength({ min: 2 })
      .withMessage('Username must be at least two characters.'),
    body('password')
      .exists()
      .withMessage(missing)
      .bail()
      .isLength({ min: 6 })
      .withMessage('Password must be at least six characters.'),
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
