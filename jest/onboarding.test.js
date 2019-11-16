const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')

describe('Tests for onboarding process', () => {})
test.todo('verify db connection')

test('Environment should be "test"', () => {
  expect(process.env.NODE_ENV).toBe('test')
})

describe('Tests for /user/register', () => {
  beforeEach(async () => {
    // clear database
    await db('users').truncate()

    test.todo('add user')
    test.todo('validate params')
    test.todo('should allow duplicates')
  })

  describe('Tests for /user/login', () => {
    beforeEach(async () => {
      // clear database
      await db('users').truncate()
    })

    test.todo('should return token if password is correct')
    test.todo('should return errror if password is incorrect')
  })
})
