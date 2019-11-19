const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { allPurpose: kxa, usersDML: kxd } = require('../db/dml')

const generateJWT = require('../jwt/generateJWT')
const secret = process.env.JWT_SECRET || 'mrAVEvn434RAC4kfdi&44'

const {
  validateLogin,
  validateRegister
} = require('./validators/onboarding.validate')
const { handleValidationErr, generalErr } = require('../middleware')

router.post(
  '/register',
  validateRegister(),
  handleValidationErr,
  async (req, res, next) => {
    try {
      const user = req.body

      // convert username to lowercase
      user.username = user.username.toLowerCase()

      // hash password
      const hashed = bcrypt.hashSync(user.password, 12)
      // replace req password with hashed version
      user.password = hashed

      // add user to db and return new user from db
      const newUser = await kxd.register(user)
      // generate token
      const token = generateJWT(newUser, secret)
      // return user and token
      res.status(201).json({ ...newUser, favorites: [], token })
    } catch (err) {
      if (err.constraint) {
        const constraint = err.constraint
        if (/username_unique/i.test(constraint)) {
          res.status(400).json({
            errors: [{ username: 'Sorry, that username is unavailable.' }]
          })
        } else if (/email_unique/i.test(constraint)) {
          res.status(400).json({
            errors: [
              {
                email:
                  'An account has already been registered with that email address.'
              }
            ]
          })
        }
      } else {
        next(err)
      }
    }
  }
)

router.post(
  '/login',
  validateLogin(),
  handleValidationErr,
  async (req, res, next) => {
    try {
      const { username, password } = req.body
      // get user from db
      const dbResult = await kxa.getOneBy({ username }, 'users', [
        'password',
        'id'
      ])

      // validate password
      if (dbResult && bcrypt.compareSync(password, dbResult.password)) {
        // get user's favorites
        const favorites = []
        // generate token
        const token = generateJWT({ dbResult })
        // return token
        res.status(200).json({ username, favorites, id: dbResult.id, token })
        return
      }
      // return error if username or password is incorrect
      res
        .status(400)
        .json({
          errors: [
            { username: 'Invalid Credentials.' },
            { password: 'Invalid Credentials.' }
          ]
        })
    } catch (err) {
      console.log({ err })
      next({ ...err })
    }
  }
)

router.use(generalErr)

module.exports = router
