const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')
const clearAndSeed = require('./utils/clearAndSeed')
const { usersDML: kxu } = require('../db/dml')

const baseURL = '/api/users/1'

const { token } = require('./mock_data/user')

describe('Tests for /user/:id/favorites', () => {
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

  test('POST route should exist for favorites', async () => {
    return request(app)
      .post(`${baseURL}/favorites`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test('Should throw error message if a comment is not provided for POST', async () => {
    return request(app)
      .post(`${baseURL}/favorites`)
      .set('authorization', token)
      .then(res => {
        expect(res.status).toBe(422)
        expect(res.body.errors.comment).toMatch(/a comment id is required./i)
      })
  })

  test('Should throw error message comment is not an integer for POST', async () => {
    return request(app)
      .post(`${baseURL}/favorites`)
      .set('authorization', token)
      .send({ comment: 'abc' })
      .then(res => {
        expect(res.status).toBe(422)
        expect(res.body.errors.comment).toMatch(/comment must be an integer./i)
      })
  })

  test('Should be able to add a favorite', async () => {
    return request(app)
      .post(`${baseURL}/favorites`)
      .set('authorization', token)
      .send({ comment: 5 })
      .then(res => {
        expect(res.status).toBe(201)
        expect(res.body.comment).toBe('5')
      })
  })

  test('DELETE route should exist for favorites', async () => {
    return request(app)
      .delete(`${baseURL}/favorites`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test('Should be able to delete a favorite', async () => {
    const res = await request(app)
      .delete(`${baseURL}/favorites`)
      .set('authorization', token)
      .send({ comment: 4 })

    expect(res.status).toBe(200)
    expect(res.body.comment).toBe('4')

    return db('user_favorites')
      .where({ user_id: 1, comment_id: 4 })
      .then(data => {
        expect(data.length).toBe(0)
      })
  })

  test('Should throw error message if a comment is not provided for DELETE', async () => {
    return request(app)
      .delete(`${baseURL}/favorites`)
      .set('authorization', token)
      .then(res => {
        expect(res.status).toBe(422)
        expect(res.body.errors.comment).toMatch(/a comment id is required./i)
      })
  })

  test('Should throw error message comment is not an integer for DELETE', async () => {
    return request(app)
      .delete(`${baseURL}/favorites`)
      .set('authorization', token)
      .send({ comment: 'abc' })
      .then(res => {
        expect(res.status).toBe(422)
        expect(res.body.errors.comment).toMatch(/comment must be an integer./i)
      })
  })

  test('GET route should exist for favorites', async () => {
    return request(app)
      .get(`${baseURL}/favorites`)
      .then(res => expect(res.status).not.toBe(404))
  })

  test("Should return list of user's favorites", async () => {
    return request(app)
      .get(`${baseURL}/favorites`)
      .set('authorization', token)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.favorites).toBeDefined()
        expect(res.body.favorites.length).toBe(4)
      })
  })
})
