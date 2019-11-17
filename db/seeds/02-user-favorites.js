exports.seed = function(knex) {
  return knex('user_favorites')
    .truncate()
    .then(function() {
      return knex('user_favorites').insert([])
    })
}
