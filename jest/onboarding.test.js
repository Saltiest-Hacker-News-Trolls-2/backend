const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')

const baseURL = '/api'
const testUser = {
  username: 'Ned',
  email: 'ned@mail.ned',
  password: 'abc?123'
}

describe('Tests for onboarding process', () => {
  test.todo('verify db connection')

  test('Environment should be "test"', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })

  describe('Tests for /register', () => {
    beforeEach(async () => {
      // clear database
      await db('users').truncate()
    })

    test('/register route should exist', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send(testUser)
        .then(res => {
          expect(res.status).not.toBe(404)
        })
    })

    test('Should be able to register new user', async () => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))
      // make registration request
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send(testUser)
      // assert correct response
      expect(res.status).toBe(201)
      expect(res.body.username).toBe(testUser.username)
      expect(res.body.id).toBeDefined()
      expect(res.body.token).toBeDefined()
      // assert database was updated
    })
    test.todo('validate param format')
    test.todo('should not allow duplicate usernames')
    test.todo('should not allow duplicate emails')
  })

  describe('Tests for /login', () => {
    beforeEach(async () => {
      // clear database
      await db('users').truncate()
    })

    test('/login route should exist', () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: testUser.username, password: testUser.password })
        .then(res => {
          expect(res.status).not.toBe(404)
        })
    })
    test.todo('should return token if password is correct')
    test.todo('should return errror if password is incorrect')
    test('Should return error if username is missing', async () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ password: testUser.password })
        .then(res => {
          expect(res.status).toBe(422)
        })
    })

    test('Should return error if password is missing', async () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: testUser.username })
        .then(res => {
          expect(res.status).toBe(422)
        })
    })
  })
})
