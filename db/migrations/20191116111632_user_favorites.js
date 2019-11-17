exports.up = function(knex) {
  return knex.schema.createTable('user_favorites', tbl => {
    tbl.increments()
  })
}

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('comments')
    .dropTableIfExists('user_favorites')
}
