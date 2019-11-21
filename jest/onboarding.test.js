const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')
const { clearTables } = require('./utils/setup')

const baseURL = '/api'
const { testUser, hashedUser, joe } = require('./mock_data/data')

beforeEach(async done => {
  // clear tables
  await db('user_favorites').del()
  await db('users').del()
  await db('comments').del()
  // reset auto-generated id's
  await db.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  done()
})

describe('Tests for onboarding process', () => {
  console.log('running onboarding tests')

  test('Environment should be "test"', done => {
    expect(process.env.NODE_ENV).toBe('test')
    done()
  })

  test('db should be empty', async () => {
    const users = await db('users')
    const comments = await db('comments')
    const favorites = await db('user_favorites')
    expect(users.length).toBe(0)
    expect(comments.length).toBe(0)
    expect(favorites.length).toBe(0)
  })

  describe('Tests for /register', () => {
    test('/register route should exist', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send(testUser)
        .then(res => {
          expect(res.status).not.toBe(404)
        })
    })

    test('Should be able to register new user', async done => {
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send(joe)
      // assert correct response
      expect(res.status).toBe(201)
      expect(res.body.username).toBeDefined()
      expect(res.body.id).toBeDefined()
      expect(res.body.token).toBeDefined()
      done()
    })

    test('Should return error if username is not provided', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ password: 'abc?123', email: 'n@n.com' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.username).toBeDefined()
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
          expect(res.body.errors.username).toBeDefined()
        })
    })

    test('Should return error if password is not provided', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ username: 'joe', email: 'n@n.com' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.password).toBeDefined()
        })
    })

    test('Should return error if email is not provided', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ username: 'joe', password: 'abc?123' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.email).toBeDefined()
        })
    })

    test('Should return error if email is not a valid format', () => {
      return request(app)
        .post(`${baseURL}/register`)
        .send({ ...joe, email: 'bbb' })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.email).toMatch(
            /please provide a valid email address/i
          )
        })
    })

    test.skip('Should store usernames in lowercase', async done => {
      // register new user
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send({ ...joe, username: 'JOE' })

      // assert correct response
      expect(res.status).toBe(201)
      expect(res.body.username).toBe('joe')
      done()
    })

    test('Usernames must be at least two characters', async done => {
      // register new user
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send({ ...joe, username: 'b' })

      // assert correct response
      expect(res.status).toBe(422)
      expect(res.body.errors.username).toMatch(
        /username must be at least two characters/i
      )
      done()
    })

    test('Should not allow duplicate usernames', async done => {
      await db('users').del()
      await db('users').insert(testUser, '*')
      // try to add invalid user
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send(testUser)
      // assert correct response
      expect(res.status).toBe(400)
      expect(res.body.errors.username).toMatch(
        /sorry, that username is unavailable./i
      )
      done()
    })

    test('Should not allow duplicate emails', async done => {
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
      expect(res.body.errors.email).toMatch(
        /an account has already been registered with that email address./i
      )
      done()
    })

    test('Password must  be at least six characters', async done => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))

      // register new user
      const res = await request(app)
        .post(`${baseURL}/register`)
        .send({ ...testUser, password: 'z' })

      // assert correct response
      expect(res.status).toBe(422)
      expect(res.body.errors.password).toMatch(
        /password must be at least six characters/i
      )
      done()
    })
  }) // end test for register

  describe('Tests for /login', () => {
    test('/login route should exist', () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: testUser.username, password: testUser.password })
        .then(res => {
          expect(res.status).not.toBe(404)
        })
    })

    test('should return token if password is correct', async done => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))
      //add user to db
      await db('users').insert(hashedUser, '*')
      db('users').then(res => expect(res.length).toBe(1))

      const loginResult = await request(app)
        .post(`${baseURL}/login`)
        .send({ password: testUser.password, username: testUser.username })

      //assert response
      expect(loginResult.status).toBe(200)
      expect(loginResult.body.username).toMatch(/ned/i)
      expect(loginResult.body.id).toBeDefined()
      expect(loginResult.body.favorites).toBeDefined()
      expect(loginResult.body.token).toBeDefined()
      done()
    })

    test('Should return error if password is incorrect', async () => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))
      //add user to db
      await db('users').insert(hashedUser, '*')
      db('users').then(res => expect(res.length).toBe(1))

      // try to login
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: testUser.username, password: 'dog' })
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.body.errors.password).toMatch(/invalid credentials./i)
        })
    })

    test('Should return error if username is incorrect', async () => {
      //db should be empty
      db('users').then(res => expect(res.length).toBe(0))
      //add user to db
      await db('users').insert(hashedUser, '*')
      db('users').then(res => expect(res.length).toBe(1))

      // try to login
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: 'not_a_user', password: testUser.password })
        .then(res => {
          expect(res.status).toBe(400)
          expect(res.body.errors.username).toMatch(/invalid credentials./i)
        })
    })

    test('Should return error if username is missing', async () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ password: testUser.password })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.username).toMatch(
            /a username is required to log in./i
          )
        })
    })

    test('Should return error if password is missing', async () => {
      return request(app)
        .post(`${baseURL}/login`)
        .send({ username: testUser.username })
        .then(res => {
          expect(res.status).toBe(422)
          expect(res.body.errors.password).toMatch(
            /a password is required to log in./i
          )
        })
    })
  })
})
