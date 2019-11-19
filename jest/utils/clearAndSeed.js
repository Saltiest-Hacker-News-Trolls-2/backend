async function clearAndSeed(db) {
  // clear database
  await db('users').del()
  await db('comments').del()
  await db('user_favorites').del()
  // reset auto-generated id's
  await db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  // await db.migrate.rollback()
  // await db.migrate.latest()
  await db.seed.run()
}

module.exports = clearAndSeed
