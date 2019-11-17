const kx = require('../db_interface')

module.exports = {
  register,
  validateUser
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

function validateUser(username) {
  return kx('users')
    .where('username', username)
    .select('password')
}
