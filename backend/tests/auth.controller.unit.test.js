import { describe, it, expect, vi, beforeEach } from 'vitest';

// this replaces the real db.js file with a fake one for this whole test file
vi.mock('../src/db.js', () => ({
  // prisma.users.findUnique / prisma.users.create become empty fake functions 
  prisma: { users: { findUnique: vi.fn(), create: vi.fn() } },
}));

import { prisma } from '../src/db.js';
import { register, login, hashPassword, verifyPassword } from '../src/controllers/auth.controller.js';

// fake Express res object
function mockRes() {
  return {
    // each fake method returns "this" to support that chaining res.status(200).json(...)
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  // clears call history/return values from the previous test,
  // so tests never leak state into each other.
  vi.resetAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

describe('POST /api/auth/register', () => {
  const validBody = {
    email: 'anyemail@fake.com',
    password: 'super_long_password',
    name: 'John Anyman',
  };

  it('returns 400 when email is missing or invalid', async () => {
    const req = { body: { ...validBody, email: 'not-an-email' } };
    const res = mockRes();

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    // the fake DB should never be reached if validation fails first.
    expect(prisma.users.findUnique).not.toHaveBeenCalled();
  });

  it('returns 400 when password is missing or too short', async () => {
    const req = { body: { ...validBody, password: 'short' } };
    const res = mockRes();

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when name is missing or empty', async () => {
    const req = { body: { ...validBody, name: '   ' } };
    const res = mockRes();

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 409 when the email is already registered', async () => {
    // tell the fake DB to pretend a user already exists with this email
    prisma.users.findUnique.mockResolvedValue({ id: 1, email: validBody.email });
    const req = { body: validBody };
    const res = mockRes();

    await register(req, res); 
    expect(res.status).toHaveBeenCalledWith(409);
    expect(prisma.users.create).not.toHaveBeenCalled();
  });

  it('returns 201 and the correct response shape on success', async () => {
    // fake DB: no existing user, and "create" resolves with a fake saved user
    prisma.users.findUnique.mockResolvedValue(null);
    prisma.users.create.mockResolvedValue({ id: 1, ...validBody });
    const req = { body: validBody };
    const res = mockRes();

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      name: validBody.name,
      csrfToken: expect.any(String),
    });
  });

  it('never returns password_hash in the response', async () => {
    prisma.users.findUnique.mockResolvedValue(null);
    prisma.users.create.mockResolvedValue({ id: 1, ...validBody });
    const req = { body: validBody };
    const res = mockRes();

    await register(req, res);
    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody.password_hash).toBeUndefined();
    expect(responseBody.password).toBeUndefined();
  });

  it('stores the password hashed, not as plain text', async () => {
    prisma.users.findUnique.mockResolvedValue(null);
    prisma.users.create.mockResolvedValue({ id: 1, ...validBody });
    const req = { body: validBody };
    const res = mockRes();

    await register(req, res);
    // read the data that register() actually sent to the fake "create" call
    const createArgs = prisma.users.create.mock.calls[0][0];
    expect(createArgs.data.password_hash).not.toBe(validBody.password);
    expect(createArgs.data.password_hash).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
  });

  it('sets a JWT as an httpOnly cookie on success', async () => {
    prisma.users.findUnique.mockResolvedValue(null);
    prisma.users.create.mockResolvedValue({ id: 1, ...validBody });
    const req = { body: validBody };
    const res = mockRes();

    await register(req, res);
    // check the cookie options passed to the fake res.cookie() call
    const cookieOptions = res.cookie.mock.calls[0][2];
    expect(cookieOptions.httpOnly).toBe(true);
  });

  it('returns 500 when the database throws an unexpected error', async () => {
    // make the fake DB call reject, like a real database failure would.
    prisma.users.findUnique.mockRejectedValue(new Error('DB is down'));
    const req = { body: validBody };
    const res = mockRes();

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('POST /api/auth/login', () => {
  const password = 'super_long_password';
  let validHash;

  beforeEach(async () => {
    // build one real password hash to reuse across the login tests below
    validHash = await hashPassword(password);
  });

  it('returns 400 when email is invalid', async () => {
    const req = { body: { email: 'not-an-email', password } };
    const res = mockRes();

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when email is missing', async () => {
    const req = { body: { password } };
    const res = mockRes();

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when password is missing', async () => {
    const req = { body: { email: 'anyemail@fake.com' } };
    const res = mockRes();

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 401 when no user is found for the email', async () => {
    // fake DB: pretend no user exists with this email
    prisma.users.findUnique.mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password } };
    const res = mockRes();

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when the password is wrong', async () => {
    // fake DB: user exists with validHash, but we log in with a different password.
    prisma.users.findUnique.mockResolvedValue({ id: 1, name: 'John', password_hash: validHash });
    const req = { body: { email: 'a@b.com', password: 'WrongPassword123' } };
    const res = mockRes();

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 200 and the correct response shape on success', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1, name: 'John', password_hash: validHash });
    const req = { body: { email: 'a@b.com', password } };
    const res = mockRes();

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ name: 'John', csrfToken: expect.any(String) });
  });

  it('never returns password_hash in the response', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1, name: 'John', password_hash: validHash });
    const req = { body: { email: 'a@b.com', password } };
    const res = mockRes();

    await login(req, res);
    const responseBody = res.json.mock.calls[0][0];
    expect(responseBody.password_hash).toBeUndefined();
  });

  it('sets a JWT as an httpOnly cookie on success', async () => {
    prisma.users.findUnique.mockResolvedValue({ id: 1, name: 'John', password_hash: validHash });
    const req = { body: { email: 'a@b.com', password } };
    const res = mockRes();

    await login(req, res);
    const cookieOptions = res.cookie.mock.calls[0][2];
    expect(cookieOptions.httpOnly).toBe(true);
  });

  it('returns 500 when the database throws an unexpected error', async () => {
    prisma.users.findUnique.mockRejectedValue(new Error('DB is down'));
    const req = { body: { email: 'a@b.com', password } };
    const res = mockRes();

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('hashPassword', () => {
  it('returns a string in "salt:hash" format', async () => {
    const result = await hashPassword('secretSECRET-6');
    expect(result).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
  });

  it('never returns the plain text password', async () => {
    const result = await hashPassword('secretSECRET-6');
    expect(result).not.toContain('secretSECRET-6');
  });

  it('produces a different hash each time, even for the same password', async () => {
    // hashPassword uses a random salt every call
    const first = await hashPassword('secretSECRET-6');
    const second = await hashPassword('secretSECRET-6');
    expect(first).not.toBe(second);
  });
});

describe('verifyPassword', () => {
  it('returns true when the password matches the hash', async () => {
    const hash = await hashPassword('secretSECRET-6');
    const result = await verifyPassword('secretSECRET-6', hash);
    expect(result).toBe(true);
  });

  it('returns false when the password does not match the hash', async () => {
    const hash = await hashPassword('secretSECRET-6');
    const result = await verifyPassword('WrongPassword123', hash);
    expect(result).toBe(false);
  });
});
