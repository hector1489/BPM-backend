const pool = require('../server/database/db');

describe('Database Utility Functions', () => {
  test('should query the database', async () => {
    const result = await pool.query('SELECT 1');
    expect(result.rows).toEqual([{ '1': 1 }]);
  });
});
