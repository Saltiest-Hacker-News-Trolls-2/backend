exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments()
    tbl
      .string('username', 50)
      .unique()
      .notNullable()
    tbl
      .string('email', 50)
      .unique()
      .notNullable()
    tbl.string('password', 60).notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
