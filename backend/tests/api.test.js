process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_123456';
process.env.SEED_SECRET = 'test_configured_seed_secret';
process.env.MONGO_URI = 'mongodb://localhost:27017/test_db';

const request = require('supertest');
const app = require('../server');

describe('Every Day Better — Backend API Tests', () => {
  describe('GET / — Health & Version', () => {
    it('should return 200 OK and version info', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Every Day Better API Running');
      expect(res.body.version).toBe('2.0');
    });

    it('should return API endpoints directory at /api', async () => {
      const res = await request(app).get('/api');
      expect(res.status).toBe(200);
      expect(res.body.endpoints).toBeDefined();
      expect(res.body.endpoints.auth).toBe('/api/auth');
      expect(res.body.endpoints.gemini).toBe('/api/gemini');
    });
  });

  describe('POST /api/run-seed — Security Hardening', () => {
    it('should reject with 403 Forbidden when secret is missing', async () => {
      const res = await request(app)
        .post('/api/run-seed')
        .send({ file: 'seedData' });
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should reject with 403 Forbidden when secret is wrong', async () => {
      const res = await request(app)
        .post('/api/run-seed')
        .send({ secret: 'wrong_guess', file: 'seedData' });
      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should reject with 403 Forbidden for the old default secret', async () => {
      const res = await request(app)
        .post('/api/run-seed')
        .send({ secret: 'seed_everydaybetter_2024', file: 'seedData' });
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/auth — Input Validation Rules', () => {
    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'not-an-email', password: 'password123' });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
    });

    it('should reject registration with password shorter than 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'valid@example.com', password: '123' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
    });

    it('should reject login without password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com' });
      expect(res.status).toBe(400);
      expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
    });

    it('should reject Google auth if credential token is missing', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.errors.some((e) => e.field === 'credential')).toBe(true);
    });
  });

  describe('AI Endpoints — Authentication & Payload Validation', () => {
    it('should return 401 Unauthorized when accessing Gemini chat without auth token', async () => {
      const res = await request(app)
        .post('/api/gemini/chat')
        .send({ messages: [{ role: 'user', content: 'Hello' }] });
      expect(res.status).toBe(401);
    });

    it('should return 401 Unauthorized when accessing Groq chat without auth token', async () => {
      const res = await request(app)
        .post('/api/groq/chat')
        .send({ messages: [{ role: 'user', content: 'Hello' }] });
      expect(res.status).toBe(401);
    });
  });
});
