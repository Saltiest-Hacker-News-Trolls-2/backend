const kx = require('../db_interface')

module.exports = {
  register,
  getFavorites
}

function register(user) {
  return kx('users')
    .insert(user, 'id')
    .then(id => {
      return kx('users')
        .where({ id: id[0] })
        .select(['id', 'username'])
        .first()
    })
}

function getFavorites(id) {
  return kx('user_favorites')
    .join('comments', 'user_favorites.comment_id', 'comments.id')
    .select('comments.id')
    .where('user_favorites.user_id', id)
}
