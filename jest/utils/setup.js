const db = require('../../db/db_interface')
const cleaner = require('knex-cleaner')

module.exports = {
  clearTables,
  clearKXCleaner,
  addTestUser,
  addTestComments,
  addTestFavorites
}

async function clearKXCleaner(db) {
  return await cleaner.clean(db, {
    mode: 'delete',
    restartIdentity: true,
    ignoreTables: ['knex_migrations', 'knex_migrations_lock']
  })
}

async function clearTables() {
  // clear tables
  await db('user_favorites').del()
  await db('users').del()
  await db('comments').del()
  // reset auto-generated id's
  const result = await db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  return result
}

function addTestUser(user) {
  return db('users').insert(user, '*')
}

function addTestComments(comments) {
  return db('comments').insert(comments, '*')
}

function addTestFavorites(favs) {
  return db('user_favorites').insert(favs, '*')
}
