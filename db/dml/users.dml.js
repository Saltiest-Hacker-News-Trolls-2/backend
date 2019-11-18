const kx = require('../db_interface')

module.exports = {
  register
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
