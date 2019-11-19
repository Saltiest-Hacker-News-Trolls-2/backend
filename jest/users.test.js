const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')
const generateJWT = require('../jwt/generateJWT')
const clearAndSeed = require('./utils/clearAndSeed')
const { usersDML: kxu } = require('../db/dml')

const token = generateJWT({ id: 1 })
const baseURL = '/api/users'

const { testUser, hashed } = require('./mock_data/user')

describe('Tests for /user', () => {
  beforeEach(async () => {
    await clearAndSeed(db)
  })

  test('Environment should be "test"', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })

  test('Verify dabase connection', async () => {
    const users = await db('users')
    expect(users.length).toBe(1)
    expect(users[0].username).toBe('ned')

    const comments = await db('comments')
    expect(comments.length).toBe(4)

    const favorites = await db('user_favorites')
    expect(favorites.length).toBe(4)
  })

  test('GET route should exist for users', async () => {
    return request(app)
      .get(`${baseURL}/1`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test('GET route return all user data', async () => {
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

  test('Should be able to delete a user from the db', async () => {
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
  })

  test("Should be able to get user's favorite comments ", async () => {
    // try to get user's favorites
    const favorites = await kxu.getFavorites(1)
    expect(favorites.length).toBe(4)
  })
})
