exports.seed = function(knex) {
  return knex('comments')
    .truncate()
    .then(function() {
      return knex('comments').insert([])
    })
}
