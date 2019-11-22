const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')

const baseURL = '/api/users'

const { token } = require('./mock_data/data')

beforeEach(async done => {
  await db.seed.run()
  done()
})

describe('Tests for /user', () => {
  console.log('running user tests')

  test('GET route should exist for users', async () => {
    return request(app)
      .get(`${baseURL}/1`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test('GET route should return all user data', async () => {
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
        expect(res.body.message).toMatch(/not authorized/i)
      })
  })

  test('DELETE route should exist for users', async () => {
    return request(app)
      .delete(`${baseURL}/1`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test('Should be able to delete a user from the db', async done => {
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
