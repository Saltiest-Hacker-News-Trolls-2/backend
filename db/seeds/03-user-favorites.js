exports.seed = function(knex, Promise) {
  return knex('user_favorites').insert([
    { user_id: 1, comment_id: 1 },
    { user_id: 1, comment_id: 2 },
    { user_id: 1, comment_id: 3 },
    { user_id: 1, comment_id: 4 }
  ])
}
