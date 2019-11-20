const router = require('express').Router()
const db = require('../db/db_interface')

const { allPurpose: kxa, usersDML: kxu } = require('../db/dml')

const {
  generalErr,
  restrictJWT,
  logErrors,
  handleValidationErr
} = require('../middleware')

const { validateFavorite } = require('./validators/users.validate')

const createFavoritesArray = require('./createFavoritesArray')

router.get('/:id', restrictJWT, async (req, res, next) => {
  try {
    let [dbResult, favorites] = await Promise.all([
      kxa.getOneBy({ id: req.params.id }, 'users', ['username', 'id']),
      kxu.getFavorites(req.params.id)
    ])

    favorites = createFavoritesArray(favorites)

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

    return res
      .status(200)
      .json({ message: 'User account successfully deleted.' })
  } catch (err) {
    next(err)
  }
})

router.get('/:id/favorites', restrictJWT, async (req, res, next) => {
  try {
    const { id } = req.params
    // get user's favorite comments
    let favorites = await kxu.getFavorites(id)
    favorites = createFavoritesArray(favorites)
    return res.status(200).json({ favorites })
  } catch (err) {
    next(err)
  }
})

router.post(
  '/:id/favorites',
  restrictJWT,
  validateFavorite(),
  handleValidationErr,
  async (req, res, next) => {
    try {
      const comment = req.body.comment
      const id = req.params.id
      //search for comment_id in comments
      const exists = await kxa.getOneBy({ id: comment }, 'comments')
      //if found add comment to user_favorites
      if (exists) {
        const alreadySaved = await kxa.getOneBy(
          { comment_id: comment, user_id: id },
          'user_favorites'
        )
        !alreadySaved &&
          (await kxa.add(
            { user_id: id, comment_id: comment },
            'user_favorites'
          ))
      } else {
        //add comment to comments first
        await kxa.add({ id: comment }, 'comments')
        await kxa.add({ user_id: id, comment_id: comment }, 'user_favorites')
      }
      // return updated list of favorites
      let favorites = await kxu.getFavorites(id)
      favorites = createFavoritesArray(favorites)
      res.status(201).json({ favorites })
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  '/:id/favorites',
  restrictJWT,
  validateFavorite(),
  handleValidationErr,
  async (req, res, next) => {
    try {
      const comment = req.body.comment
      const id = req.params.id
      //search for comment_id in user_favorites
      const exists = await kxa.getOneBy(
        { user_id: id, comment_id: comment },
        'user_favorites'
      )
      if (exists) {
        //if found remove from from user_favorites
        await db('user_favorites')
          .where({ user_id: id, comment_id: comment })
          .del()

        // if the comment is not referenced by any other users remove it from comments
        const isReferenced = await kxa.getAllBy(
          { comment_id: comment },
          'user_favorites'
        )
        if (!isReferenced.length) {
          await kxa.remove(comment, 'comments')
        }

        // return updated list of favorites
        let favorites = await kxu.getFavorites(id)
        favorites = createFavoritesArray(favorites)
        res.status(200).json({ favorites })
      } else {
        res.status(400).json({ errors: { comments: 'Favorite not found.' } })
      }
    } catch (err) {
      next(err)
    }
  }
)

router.use(logErrors, generalErr)
module.exports = router
