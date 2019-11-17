const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { allPurpose: kxa, usersDML: kxd } = require('../db/dml')

const generateJWT = require('../jwt/generateJWT')
const secret = process.env.JWT_SECRET || 'mrAVEvn434RAC4kfdi&44'

const { validateLogin } = require('./validators/onboarding.validate')
const { handleValidationErr, generalErr } = require('../middleware')

router.post('/register', async (req, res, next) => {
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
    next(err)
  }
})

router.post(
  '/login',
  validateLogin(),
  handleValidationErr,
  async (req, res, next) => {
    try {
      const { username, password } = req.body
      // validate password
      // const { password: hashed, id } = await kxa.getOneBy(
      const dbResult = await kxa.getOneBy({ username }, 'users', [
        'password',
        'id'
      ])

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
      next({ type: 'INVALIDCRED' })
    } catch (err) {
      console.log({ err })
      next({ ...err })
    }
  }
)

router.use(generalErr)

module.exports = router
