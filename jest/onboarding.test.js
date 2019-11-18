const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')

const baseURL = '/api'
const testUser = {
  username: 'Ned',
  email: 'ned@mail.com',
  password: 'abc?123'
}
const hashed = '$2a$12$QAKFHsSTGOSLASd7mUhiCeQFcUTxD4ObQnfomm0g32oXsN8gBOqpi'

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
      expect(res.body.username).toBeDefined()
      expect(res.body.id).toBeDefined()
      expect(res.body.token).toBeDefined()
      // assert database was updated
    })

    test('Should return error if username is not provided', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ password: 'abc?123', email: 'n@n.com' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.length).toBe(1)
        })
    })

    test('Should return error if username contains invalid characters', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({
          password: 'abc?123',
          email: 'n@n.com',
          username: 'bad username'
        })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.length).toBe(1)
        })
    })

    test('Should return error if password is not provided', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ username: 'joe', email: 'n@n.com' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.length).toBe(1)
        })
    })

    test('Should return error if email is not provided', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ username: 'joe', password: 'abc?123' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.length).toBe(1)
        })
    })

    test('Should return error if email is not a valid format', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ ...testUser, email: 'bbb' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors[0]).toMatch(
            /please provide a valid email address/i
          )
        })
    })

    test('Should store usernames in lowercase', async () => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))

      // register new user
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send(testUser)

      // assert correct response
      expect(res.status).toBe(201)
      expect(res.body.username).toBe('ned')
    })

    test('Should not allow duplicate usernames', async () => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))

      // add user to db
      const id = await db('users').insert({ ...testUser, username: 'ned' })
      const user = await db('users').first()

      expect(user.username).toBe('ned')

      // try to add user again
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send(testUser)
      // assert correct response
      expect(res.status).toBe(400)
      expect(res.body.errors[0]).toMatch(
        /sorry, that username is unavailable./i
      )
    })

    test('Should not allow duplicate emails', async () => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))

      // add user to db
      db('users')
        .insert(testUser)
        .then(res => expect(res.length).toBe(1))
      // try to add user again
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send({ ...testUser, username: 'julie' })
      // assert correct response
      expect(res.status).toBe(400)
      expect(res.body.errors[0]).toMatch(
        /an account has already been registered with that email address./i
      )
    })

    test.todo('validate param format')
  }) // end test for register

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

    test('should return token if password is correct', async () => {
      // add user to db
      await db('users').insert({ ...testUser, password: hashed })
      // check that user was added to db
      let isInDB = await db('users')
        .where('username', testUser.username)
        .first()
      expect(isInDB.username).toMatch(/ned/i)
      // try to login
      const loginResult = await request(app)
        .post(`${baseURL}/login`)
        .send({ password: testUser.password, username: testUser.username })

      //assert response
      expect(loginResult.status).toBe(200)
      expect(loginResult.body.username).toMatch(/ned/i)
      expect(loginResult.body.id).toBeDefined()
      expect(loginResult.body.favorites).toBeDefined()
      expect(loginResult.body.token).toBeDefined()
    })

    test('Should return error if password is incorrect', async () => {
      // add user to db
      await db('users').insert({ ...testUser, password: hashed })
      // check that user was added to db
      let isInDB = await db('users')
        .where('username', testUser.username)
        .first()
      expect(isInDB.username).toMatch(/ned/i)

      // try to login
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: testUser.username, password: 'dog' })
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.body.errors.length).toBe(1)
          expect(res.body.errors[0]).toMatch(/invalid credentials./i)
        })
    })

    test('Should return error if username is incorrect', async () => {
      // add user to db
      await db('users').insert({ ...testUser, password: hashed })
      // check that user was added to db
      let isInDB = await db('users')
        .where('username', testUser.username)
        .first()
      expect(isInDB.username).toMatch(/ned/i)

      // try to login
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: 'not_a_user', password: testUser.password })
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.body.errors.length).toBe(1)
          expect(res.body.errors[0]).toMatch(/invalid credentials./i)
        })
    })

    test('Should return error if username is missing', async () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ password: testUser.password })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.length).toBe(1)
          expect(res.body.errors[0]).toMatch(
            /username and password are required to log in./i
          )
        })
    })

    test('Should return error if password is missing', async () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: testUser.username })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.length).toBe(1)
          expect(res.body.errors[0]).toMatch(
            /username and password are required to log in./i
          )
        })
    })
  })
})
