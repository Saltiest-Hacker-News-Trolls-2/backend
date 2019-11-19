const router = require('express').Router()
const bcrypt = require('bcryptjs')

const { allPurpose: kxa, usersDML: kxu } = require('../db/dml')
const { generalErr, restrictJWT } = require('../middleware')

router.get('/:id', restrictJWT, async (req, res, next) => {
  try {
    let [dbResult, favorites] = await Promise.all([
      kxa.getOneBy({ id: req.params.id }, 'users', ['username', 'id']),
      kxu.getFavorites(req.params.id)
    ])

    favorites = favorites.map(fav => fav.id)

    return res.status(200).json({ ...dbResult, favorites })
  } catch (err) {
    next(err)
  }
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
