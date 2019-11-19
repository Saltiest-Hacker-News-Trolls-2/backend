const router = require('express').Router()
const bcrypt = require('bcryptjs')
const db = require('../db/db_interface')

const { allPurpose: kxa, usersDML: kxu } = require('../db/dml')
const { generalErr, restrictJWT, logErrors } = require('../middleware')

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

router.post('/:id/favorites', restrictJWT, async (req, res, next) => {
  try {
    const comment = req.body.comment
    const id = req.params.id
    //search for comment id in comments
    const exists = await kxa.getOneBy({ id: comment }, 'comments')
    //if found add row row to user_favorites
    if (exists) {
      const alreadySaved = await kxa.getOneBy(
        { comment_id: comment, user_id: id },
        'user_favorites'
      )
      !alreadySaved &&
        (await kxa.add({ user_id: id, comment_id: comment }, 'user_favorites'))
    } else {
      //add comment to comments first
      await kxa.add({ id: comment }, 'comments')
      await kxa.add({ user_id: id, comment_id: comment }, 'user_favorites')
    }
    // return id of added comment
    res.status(201).json({ comment })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id/favorites', restrictJWT, async (req, res, next) => {
  // return id of removed comment
  res.status(418)
})

router.use(logErrors, generalErr)
module.exports = router
