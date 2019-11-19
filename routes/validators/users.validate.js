const { body } = require('express-validator')

const { allPurpose: kxa } = require('../../db/dml')

module.exports = {
  validateFavorite
}

function validateFavorite() {
  return [
    body('comment')
      .exists()
      .withMessage('A comment ID is required.')
      .not()
      .matches(/[^\d]/)
      .withMessage('Comment must be an integer.')
      .trim()
  ]
}
