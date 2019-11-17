const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { allPurpose: kxa, usersDML: kxd } = require('../db/dml')

const generateJWT = require('../jwt/generateJWT')
const secret = process.env.JWT_SECRET || 'mrAVEvn434RAC4kfdi&44'

const { validateLogin } = require('./validators/onboarding.validate')
const { handleValidationErr } = require('../middleware')

router.post('/register', async (req, res) => {
  const user = req.body
  // hash password
  const hashed = bcrypt.hashSync(user.password, 12)
  // replace req password with hashed version
  user.password = hashed

  try {
    // add user to db and return new user from db
    const newUser = await kxd.register(user)
    // generate token
    const token = generateJWT(newUser, secret)
    // return user and token
    res.status(201).json({ ...newUser, token })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'There was an error processing your request', err })
  }
})

router.post(
  '/login',
  validateLogin(),
  handleValidationErr,
  async (req, res) => {
    try {
      res.status(418).send('im a teapot')
    } catch (err) {
      res
        .status(500)
        .json({ message: 'There was an error processing your reqest', err })
    }
  }
)

module.exports = router
