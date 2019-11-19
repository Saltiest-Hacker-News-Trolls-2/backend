const { body } = require('express-validator')

const { allPurpose: kxa } = require('../../db/dml')

module.exports = {
  validateLogin,
  validateRegister
}

function validateRegister() {
  return [
    body('username')
      .exists()
      .withMessage('A username is required.')
      .not()
      .matches(/[\W]/)
      .withMessage(
        'Username may only contain letters, numbers, and underscores.'
      )
      .isLength({ min: 2 })
      .withMessage('Username must be at least two characters.'),
    body('password')
      .exists()
      .withMessage('A password is required.')
      .isLength({ min: 6 })
      .withMessage('Password must be at least six characters.'),
    body('email')
      .exists()
      .withMessage('An email address is required.')
      .isEmail()
      .withMessage('Please provide a valid email address.')
      .trim()
  ]
}

function validateLogin() {
  return [
    body('username')
      .exists()
      .withMessage('A username is required to log in.'),
    body('password')
      .exists()
      .withMessage('A password is required to log in.')
  ]
}
