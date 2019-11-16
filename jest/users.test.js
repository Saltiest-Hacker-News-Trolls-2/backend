const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')

describe('Tests for onboarding process', () => {})
test.todo('verify db connection')

test('Environment should be "test"', () => {
  expect(process.env.NODE_ENV).toBe('test')
})

describe('Tests for /user', () => {
  beforeEach(async () => {
    // clear database
    await db('users').truncate()

    test.todo('get user data')
    test.todo('should not be able to access user data without token')
    test.todo('should only be allowed to access userdata with correct id')
  })
})
