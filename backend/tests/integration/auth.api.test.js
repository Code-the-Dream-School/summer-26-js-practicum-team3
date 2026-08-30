import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import { prisma } from '../../src/db.js';
import jwt from 'jsonwebtoken';

// Unlike auth.controller.test.js (which calls register()/login() directly),
// these tests go through the real Express stack: app.js routing, JSON parsing,
// and most importantly errorHandler - to prove thrown errors
// actually reach it and come back out as the right HTTP response.
process.env.JWT_SECRET = 'test-secret';

describe('POST /api/v1/auth/register - through the full Express stack', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const validBody = {
    email: 'integration@fake.com',
    password: 'Super_Long_Password1!',
    name: 'Integration Test',
  };

  it('returns 400 with the Joi validation message for a bad body', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validBody, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });

  it('returns 409 when the email is already registered', async () => {
    vi.spyOn(prisma.users, 'findUnique').mockResolvedValue({
      id: 1,
      email: validBody.email,
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validBody);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: 'Email already registered' });
  });

  it('returns 201, the user, and a jwt cookie on success', async () => {
    // vi.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);
    // vi.spyOn(prisma.users, 'create').mockResolvedValue({ id: 1, ...validBody });
    vi.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
      return callback({
        users: {
          create: vi.fn().mockResolvedValue({
            id: 1,
            email: validBody.email,
            name: validBody.name,
          }),
        },
        nutritional_goals: {
          create: vi.fn().mockResolvedValue({}),
        },
      });
    });

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validBody);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      name: validBody.name,
      csrfToken: expect.any(String),
    });
    expect(res.headers['set-cookie'][0]).toMatch(/^jwt=/);
  });

  it('hides the raw DB error behind a generic 500 message', async () => {
    vi.spyOn(prisma.users, 'findUnique').mockRejectedValue(
      new Error('Connection terminated unexpectedly'),
    );

    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(validBody);

    expect(res.status).toBe(500);
    // errorHandler must not leak the raw error message to the client
    expect(res.body).toEqual({ message: 'Connection terminated unexpectedly' });
  });
});

describe('POST /api/v1/auth/login - through the full Express stack', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 with the Joi validation message for a bad body', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'not-an-email', password: 'whatever123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });

  it('returns 401 with a generic message when the user does not exist', async () => {
    vi.spyOn(prisma.users, 'findUnique').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@fake.com', password: 'whatever123' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid email or password' });
  });

  it('hides the raw DB error behind a generic 500 message', async () => {
    vi.spyOn(prisma.users, 'findUnique').mockRejectedValue(
      new Error('Connection terminated unexpectedly'),
    );

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@fake.com', password: 'whatever123' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: 'Connection terminated unexpectedly',
    });
  });
});

describe('GET /api/v1/auth/me - through the full Express stack', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  const payload = {
    id: 1,
    csrfToken: 'test-csrf-token',
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  it('returns 401 when no jwt cookie is sent', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'No user is authenticated.' });
  });

  it('returns 200 when jwt cookie is validated', async () => {
    vi.spyOn(prisma.users, 'findUnique').mockResolvedValue({
      name: 'Test User',
    });

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', `jwt=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      name: 'Test User',
      csrfToken: 'test-csrf-token',
    });
  });
});
