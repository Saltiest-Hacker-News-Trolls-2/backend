const app = require('../server/server')
const request = require('supertest')
const db = require('../db/db_interface')

describe('Tests for server.js', () => {
  test('Environment should be "test"', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })
  test.todo('should return message for invalid route')
})
