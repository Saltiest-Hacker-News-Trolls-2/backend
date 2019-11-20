exports.up = function(knex) {
  return knex.schema.createTable('comments', tbl => {
    tbl
      .integer('id')
      .unique()
      .notNullable()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments')
}
