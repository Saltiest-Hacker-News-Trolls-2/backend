exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_favorites', tbl => {
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    tbl
      .integer('comment_id')
      .unsigned()
      .notNullable()
      .references('comments.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    tbl.primary(['user_id', 'comment_id'])
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_favorites')
}
