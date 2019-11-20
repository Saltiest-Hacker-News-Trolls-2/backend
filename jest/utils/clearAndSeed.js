async function clearAndSeed(db) {
  // clear database
  await db('users').del()
  await db('comments').del()
  await db('user_favorites').del()
  // reset auto-generated id's
  await db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  /*
  await db('users').insert(
    {
      username: 'ned',
      email: 'ned@mail.com',
      password: '$2a$12$QAKFHsSTGOSLASd7mUhiCeQFcUTxD4ObQnfomm0g32oXsN8gBOqpi'
    },
    '*'
  )

  await db('comments').insert([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], '*')

  await db('user_favorites').insert(
    [
      { user_id: 1, comment_id: 1 },
      { user_id: 1, comment_id: 2 },
      { user_id: 1, comment_id: 3 },
      { user_id: 1, comment_id: 4 }
    ],
    '*'
  )
  */
  return await db.seed.run()
}

module.exports = clearAndSeed
