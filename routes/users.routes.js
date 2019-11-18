const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { allPurpose: kxa } = require('../db/dml')
const { generalErr, restrictJWT } = require('../middleware')

router.get('/:id', restrictJWT, (req, res) => {
  res.status(200).send('hello from GET /users')
})

router.delete('/:id', restrictJWT, async (req, res, next) => {
  try {
    const { id } = req.params
    // remove user from db
    await kxa.remove(id, 'users')

    res.status(200).json({ message: 'User account successfully deleted.' })
  } catch (err) {
    next(err)
  }
})

router.use(generalErr)
module.exports = router
