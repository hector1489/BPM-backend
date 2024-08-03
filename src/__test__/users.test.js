const request = require('supertest');
const app = require('../server/index');

jest.mock('../server/database/db', () => ({
  query: jest.fn(),
}));

const db = require('../server/database/db');

beforeAll(() => {
  db.query.mockResolvedValueOnce([]);
  db.query.mockResolvedValueOnce([{ username: 'testuser', password: 'hashedpassword', direction: 'Test Direction', email: 'test@example.com' }]);
});

describe('User Endpoints', () => {
  it('should register a new user', async () => {
    db.query.mockResolvedValueOnce([{ email: 'newuser@example.com' }]);

    const res = await request(app)
      .post('/register')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
        direction: 'New Direction',
        rol: 'user'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('email', 'newuser@example.com');
  });

  it('should login an existing user', async () => {
    db.query.mockResolvedValueOnce([{ email: 'test@example.com', password: 'hashedpassword' }]);

    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
