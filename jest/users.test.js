const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')
const { clearTables } = require('./utils/setup')

const { usersDML: kxu } = require('../db/dml')

const baseURL = '/api/users'

const { token, hashedUser, comments, favorites } = require('./mock_data/data')

beforeEach(async done => {
  // clear tables
  await db('user_favorites').del()
  await db('users').del()
  await db('comments').del()
  // reset auto-generated id's
  await db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  done()
})

describe('Tests for /user', () => {
  console.log('running user tests')

  test('db should be empty', async done => {
    const users = await db('users')
    const comments = await db('comments')
    const favorites = await db('user_favorites')
    expect(users.length).toBe(0)
    expect(comments.length).toBe(0)
    expect(favorites.length).toBe(0)
    done()
  })

  test('GET route should exist for users', async () => {
    return request(app)
      .get(`${baseURL}/1`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test('GET route should return all user data', async () => {
    //db should be empty
    db('users').then(res => expect(res.length).toBe(0))
    db('user_favorites').then(res => expect(res.length).toBe(0))
    //add user to db
    const u = await db('users').insert(hashedUser, '*')
    const c = await db('comments').insert(comments, '*')
    const favs = await db('user_favorites').insert(favorites, '*')

    return request(app)
      .get(`${baseURL}/1`)
      .set('authorization', token)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.username).toBeDefined()
        expect(res.body.id).toBeDefined()
        expect(res.body.favorites.length).toBe(4)
      })
  })

  test('User should only be able access resources with matching id', async () => {
    // try to access data of user other than one in token

    return request(app)
      .get(`${baseURL}/99999`)
      .set('authorization', token)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.errors[0]).toMatch(/not authorized/i)
      })
  })

  test('DELETE route should exist for users', async () => {
    return request(app)
      .delete(`${baseURL}/1`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test('Should be able to delete a user from the db', async done => {
    const u = await db('users').insert(hashedUser)

    // remove user using from db
    const result = await request(app)
      .delete(`${baseURL}/1`)
      .set('authorization', token)

    // assert response
    expect(result.status).toBe(200)
    expect(result.body.message).toMatch(/user account successfully deleted/i)
    // user removed from db
    const user = await db('users')
      .where('username', 'Ned')
      .first()
    expect(user).toBe(undefined)
    done()
  })
})
