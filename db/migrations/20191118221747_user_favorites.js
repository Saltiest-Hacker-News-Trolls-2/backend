exports.up = function(knex) {
  return knex.schema.createTable('user_favorites', tbl => {
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    tbl
      .integer('comment_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('comments')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')

    tbl.primary(['user_id', 'comment_id'])
  })
}

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('comments')
    .dropTableIfExists('user_favorites')
}
