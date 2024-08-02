const { verifyCredentials } = require('../models/user.dao');
const db = require('../database/db');
const { compareSync } = require('../../utils/bcrypt');

jest.mock('../database/db');
jest.mock('../../utils/bcrypt');

describe('User DAO Functions', () => {
  const mockUser = { id: 1, email: 'test@example.com', password: 'hashedpassword' };

  test('should verify user credentials', async () => {
    db.mockResolvedValue([mockUser]);
    compareSync.mockReturnValue(true);

    const result = await verifyCredentials(mockUser.email, 'password');
    expect(result).toEqual([mockUser]);
  });
});
