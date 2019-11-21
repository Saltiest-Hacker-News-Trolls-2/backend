exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', tbl => {
    tbl
      .integer('id')
      .unique()
      .notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments')
}
