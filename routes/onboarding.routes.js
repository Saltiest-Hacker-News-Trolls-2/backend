const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { allPurpose: kxa, usersDML: kxu } = require('../db/dml')

const generateJWT = require('../jwt/generateJWT')
const secret = process.env.JWT_SECRET || 'mrAVEvn434RAC4kfdi&44'

const {
  validateLogin,
  validateRegister
} = require('./validators/onboarding.validate')

const {
  handleValidationErr,
  generalErr,
  checkRegistration
} = require('../middleware')

router.post(
  '/register',
  validateRegister(),
  handleValidationErr,
  checkRegistration,
  async (req, res, next) => {
    try {
      const user = req.body

      // hash password
      const hashed = bcrypt.hashSync(user.password, 12)
      // replace req password with hashed version
      user.password = hashed

      // add user to db and return new user from db
      const newUser = await kxu.register(user)
      // generate token
      const token = generateJWT(newUser, secret)
      // return user and token
      res.status(201).json({ ...newUser, favorites: [], token })
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  '/login',
  validateLogin(),
  handleValidationErr,
  async (req, res, next) => {
    try {
      const user = req.body
      user.username = user.username.toLowerCase()
      // get user from db
      const dbResult = await kxa.getOneBy(
        { username: user.username },
        'users',
        ['password', 'id']
      )

      // validate password
      if (dbResult && bcrypt.compareSync(user.password, dbResult.password)) {
        // get user's favorites
        const favorites = []
        // generate token
        const token = generateJWT({ dbResult })
        // return token
        res
          .status(200)
          .json({ username: user.username, favorites, id: dbResult.id, token })
        return
      }
      // return error if username or password is incorrect
      res.status(400).json({
        errors: {
          username: 'Invalid Credentials.',
          password: 'Invalid Credentials.'
        }
      })
    } catch (err) {
      next({ ...err })
    }
  }
)

router.use(generalErr)

module.exports = router
