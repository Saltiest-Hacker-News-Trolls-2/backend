const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')
const generateJWT = require('../jwt/generateJWT')

const token = generateJWT({ id: 1 })
const baseURL = '/api/users'

const { testUser, hashed } = require('./mock_data/user')

describe('Tests for /user', () => {
  beforeEach(async () => {
    // clear database
    await db('users').truncate()
  })

  test('Environment should be "test"', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })

  test('Verify dabase connection', () => {
    db('users').then(res => {
      expect(res.length).toBeDefined()
    })
  })

  test('GET route should exist for users', async () => {
    return request(app)
      .get(`${baseURL}/1`)
      .then(res => expect(res.status).not.toBe(404))
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
    // db should be empty
    let users = await db('users')
    expect(users.length).toBe(0)
    // add user to db
    await db('users').insert(testUser)
    users = await db('users')
    expect(users.length).toBe(1)

    // remove user using from db
    const result = await request(app)
      .delete(`${baseURL}/1`)
      .set('authorization', token)

    // assert response
    expect(result.status).toBe(200)
    expect(result.body.message).toMatch(/user account successfully deleted/i)
    // user removed from db
    users = await db('users')
    expect(users.length).toBe(0)
  })

  test.todo('get user data')
  test.todo('should not be able to access user data without token')
  test.todo('should only be allowed to access userdata with correct id')
  test.todo('verify db connection')
})
