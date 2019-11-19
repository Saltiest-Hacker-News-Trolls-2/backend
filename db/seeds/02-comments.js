exports.seed = function(knex) {
  return knex('comments')
    .delete()
    .then(function() {
      return knex('comments').insert([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
      ])
    })
}
