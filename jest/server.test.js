const app = require('../server/server')
const request = require('supertest')
const { available_routes } = require('../server/helpMessage')

describe('Tests for server.js', () => {
  test('Environment should be "test"', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })

  test('Should return error message for unknown routes', async () => {
    const res = await request(app).get('/nonsense')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ available_routes })
  })
})
