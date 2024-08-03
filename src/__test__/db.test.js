const db = require('../server/database/db');

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Database Utility Functions', () => {
  test('should query the database', async () => {
    const rows = await db('SELECT 1');
    expect(rows).toEqual([]);
  });
});
