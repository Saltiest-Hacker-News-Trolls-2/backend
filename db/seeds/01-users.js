exports.seed = function(knex) {
  return knex('users').insert([
    {
      username: 'ned',
      email: 'ned@mail.com',
      password: '$2a$12$QAKFHsSTGOSLASd7mUhiCeQFcUTxD4ObQnfomm0g32oXsN8gBOqpi'
    }
  ])
}
