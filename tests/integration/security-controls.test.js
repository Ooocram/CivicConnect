const request = require('supertest');
const app = require('../../src/app');
const { sequelize, resetDb } = require('../helpers/db');
beforeEach(resetDb);
afterAll(() => sequelize.close());
describe('Security controls', () => {
  test('rejects unapproved browser origins', async () => {
    const response = await request(app).options('/api/v1/requests').set('Origin', 'https://evil.example').set('Access-Control-Request-Method', 'POST');
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
  test('permits approved origin', async () => {
    const origin = process.env.CORS_ALLOWED_ORIGINS?.split(',')[0] || 'http://localhost:3000';
    const response = await request(app).options('/api/v1/requests').set('Origin', origin).set('Access-Control-Request-Method', 'POST');
    expect(response.headers['access-control-allow-origin']).toBe(origin);
  });
  test('limits repeated public writes with HTTP 429', async () => {
    // Send invalid payloads: limiter runs before validation; no database writes.
    let limited = false;
    for (let i = 0; i < 40; i++) {
      const response = await request(app).post('/api/v1/requests').send({});
      if (response.status === 429) { limited = true; expect(response.body.error.code).toBe('RATE_LIMITED'); break; }
    }
    expect(limited).toBe(true);
  });
});
